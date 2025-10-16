import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createSupabaseRouteHandlerClient } from '../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect') ?? '/dashboard';

  if (code) {
    const supabase = createSupabaseRouteHandlerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}

