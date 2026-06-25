import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { slugify } from '@/lib/utils';

type RegisterPayload = {
  fullName?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  username?: string;
  password?: string;
};

export async function POST(request: Request) {
  let createdUserId: string | null = null;

  try {
    const payload = (await request.json()) as RegisterPayload;
    const fullName = String(payload.fullName ?? '').trim();
    const email = String(payload.email ?? '').trim().toLowerCase();
    const phone = String(payload.phone ?? '').trim();
    const businessName = String(payload.businessName ?? '').trim();
    const username = slugify(String(payload.username || payload.businessName || '').trim());
    const password = String(payload.password ?? '');

    if (!fullName || !email || !phone || !businessName || !username || !password) {
      return NextResponse.json({ error: 'Please fill in all fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const useAdminSignup = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const supabaseAdmin = useAdminSignup
      ? getSupabaseAdmin()
      : createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
            },
          },
        );

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Supabase database credentials are not configured' }, { status: 500 });
    }

    const { data: existingMiddleman, error: usernameError } = useAdminSignup
      ? await supabaseAdmin
          .from('middlemen')
          .select('id')
          .eq('store_slug', username)
          .maybeSingle()
      : { data: null, error: null };

    if (usernameError) {
      return NextResponse.json({ error: usernameError.message }, { status: 500 });
    }

    if (existingMiddleman) {
      return NextResponse.json({ error: 'That username is already taken' }, { status: 409 });
    }

    const { data: createdUser, error: createUserError } = useAdminSignup
      ? await getSupabaseAdmin().auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName, role: 'middleman' },
        })
      : await supabaseAdmin.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
              role: 'middleman',
              business_name: businessName,
              store_slug: username,
            },
          },
        });

    if (createUserError || !createdUser.user) {
      return NextResponse.json({ error: createUserError?.message ?? 'Could not create user' }, { status: 400 });
    }

    createdUserId = createdUser.user.id;

    if (!useAdminSignup && !('session' in createdUser && createdUser.session)) {
      return NextResponse.json({
        error: 'Account created, but Supabase email confirmation is enabled. Disable email confirmations in Supabase Auth settings or add SUPABASE_SERVICE_ROLE_KEY to create immediately active users.',
        needsConfirmation: true,
      }, { status: 409 });
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: createdUserId,
      email,
      full_name: fullName,
      phone,
      role: 'middleman',
      is_active: true,
    });

    if (profileError) throw new Error(profileError.message);

    const { error: middlemanError } = await supabaseAdmin.from('middlemen').insert({
      user_id: createdUserId,
      business_name: businessName,
      store_slug: username,
      phone,
      status: 'active',
    });

    if (middlemanError) throw new Error(middlemanError.message);

    return NextResponse.json({ email, username });
  } catch (error) {
    if (createdUserId && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        await getSupabaseAdmin().auth.admin.deleteUser(createdUserId);
      } catch {
        // Best effort cleanup if profile or middleman creation fails.
      }
    }

    const message = error instanceof Error ? error.message : 'Could not create account';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
