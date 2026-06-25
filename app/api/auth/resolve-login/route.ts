import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const { identifier } = await request.json();
    const username = String(identifier ?? '').trim().toLowerCase();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const hasAdminKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const supabase = hasAdminKey
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

    if (!hasAdminKey) {
      const { data: email, error } = await supabase.rpc('get_middleman_login_email', {
        login_username: username,
      });

      if (error) {
        return NextResponse.json({
          error: 'Username login needs the latest Supabase migration or SUPABASE_SERVICE_ROLE_KEY.',
        }, { status: 500 });
      }

      if (!email) {
        return NextResponse.json({ error: 'No middleman found for that username' }, { status: 404 });
      }

      return NextResponse.json({ email });
    }

    const { data, error } = await supabase
      .from('middlemen')
      .select('profiles(email)')
      .eq('store_slug', username)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profile = Array.isArray(data?.profiles) ? data?.profiles[0] : data?.profiles;
    const email = profile?.email;

    if (!email) {
      return NextResponse.json({ error: 'No middleman found for that username' }, { status: 404 });
    }

    return NextResponse.json({ email });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not resolve username';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
