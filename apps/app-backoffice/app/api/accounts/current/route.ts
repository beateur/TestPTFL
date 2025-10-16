import { NextResponse } from 'next/server';
import { getAppConfig } from '../../../../lib/config';
import { createSupabaseRouteHandlerClient } from '../../../../lib/supabase/server';
import { trackEvent } from '../../../../lib/telemetry';

export async function GET() {
  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'non authentifié' }, { status: 401 });
  }

  const config = getAppConfig();
  const response = await fetch(`${config.api.baseUrl}/accounts/current`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    trackEvent('accounts.plan_limit_warning', { reason: 'backend_error', status: response.status });
    return NextResponse.json(await response.json(), { status: response.status });
  }

  return NextResponse.json(await response.json());
}

