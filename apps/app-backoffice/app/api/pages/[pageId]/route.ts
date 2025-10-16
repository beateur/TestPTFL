import { NextResponse } from 'next/server';
import { getAppConfig } from '../../../../lib/config';
import { createSupabaseRouteHandlerClient } from '../../../../lib/supabase/server';
import { trackEvent } from '../../../../lib/telemetry';
import type { PageDefinition } from '../../../../lib/types';

function mapPage(record: any): PageDefinition {
  return {
    id: record.id,
    artistId: record.artist_id,
    title: record.title,
    slug: record.slug,
    seoDescription: record.seo_description ?? '',
    status: record.is_hidden ? 'draft' : 'published',
    updatedAt: record.updated_at ?? undefined,
    publishedAt: record.published_at ?? null,
    sections: (record.sections ?? [])
      .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      .map((section: any) => ({
        id: section.id,
        type: section.type,
        isVisible: section.is_visible ?? true,
        data: section.data ?? {}
      }))
  };
}

export async function PATCH(request: Request, { params }: { params: { pageId: string } }) {
  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'non authentifié' }, { status: 401 });
  }

  const body = await request.json();
  const config = getAppConfig();

  const response = await fetch(`${config.api.baseUrl}/pages/${params.pageId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...body,
      sections: Array.isArray(body.sections)
        ? body.sections.map((section: any) => ({
            id: section.id,
            type: section.type,
            data: section.data,
            isVisible: section.isVisible
          }))
        : undefined
    })
  });

  if (!response.ok) {
    return NextResponse.json(await response.json(), { status: response.status });
  }

  if (body.status) {
    trackEvent('builder.publish', {
      pageId: params.pageId,
      status: body.status
    });
  }

  const payload = await response.json();
  return NextResponse.json(mapPage(payload));
}
