import { NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '../../../lib/supabase/server';
import { trackEvent } from '../../../lib/telemetry';

export async function POST() {
  const supabase = createSupabaseRouteHandlerClient();
  await supabase.auth.signOut();
  trackEvent('auth.logout');
  return NextResponse.json({ success: true });
}

