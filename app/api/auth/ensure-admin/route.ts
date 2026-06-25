import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAIL = 'riaoswal403@gmail.com';
const ADMIN_PASSWORD = 'osra1234';

export async function POST() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const existingAdmin = existingUsers.users.find(
      (user) => user.email?.toLowerCase() === ADMIN_EMAIL,
    );

    const { data: userData, error: userError } = existingAdmin
      ? await supabaseAdmin.auth.admin.updateUserById(existingAdmin.id, {
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: 'OSRA Admin', role: 'admin' },
        })
      : await supabaseAdmin.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: 'OSRA Admin', role: 'admin' },
        });

    if (userError || !userData.user) {
      return NextResponse.json({ error: userError?.message ?? 'Could not prepare admin user' }, { status: 500 });
    }

    const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
      id: userData.user.id,
      email: ADMIN_EMAIL,
      full_name: 'OSRA Admin',
      role: 'admin',
      is_active: true,
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ email: ADMIN_EMAIL });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not prepare admin login';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
