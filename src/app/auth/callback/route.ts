import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code       = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type       = searchParams.get('type') as 'email' | 'magiclink' | 'recovery' | null;
  const next       = searchParams.get('next') ?? '/en/album';

  const supabase = await createClient();

  if (code) {
    // OAuth (Google) — PKCE code exchange
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  if (token_hash && type) {
    // Magic link / OTP
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  // Auth failed — back to sign in
  return NextResponse.redirect(`${origin}/en/auth?error=1`);
}
