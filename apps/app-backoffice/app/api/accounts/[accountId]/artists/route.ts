import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAppConfig } from '../../../../../lib/config';
import { createSupabaseRouteHandlerClient } from '../../../../../lib/supabase/server';

export async function GET(request: NextRequest, { params }: { params: { accountId: string } }) {
  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'non authentifié' }, { status: 401 });
  }

  const config = getAppConfig();
  const response = await fetch(`${config.api.baseUrl}/accounts/${params.accountId}/artists`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    },
    cache: 'no-store'
  });

  return NextResponse.json(await response.json(), { status: response.status });
}

