import { NextResponse } from 'next/server';
import { getAppConfig } from '../../../../../lib/config';
import { createSupabaseRouteHandlerClient } from '../../../../../lib/supabase/server';
import { trackEvent } from '../../../../../lib/telemetry';
import type { PageDefinition } from '../../../../../lib/types';

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

function buildDefaultSections() {
  return [
    {
      type: 'hero',
      data: {
        heading: 'Nouvelle page',
        subheading: 'Ajoutez une description inspirante',
        backgroundImage: ''
      },
      isVisible: true
    }
  ];
}

export async function GET(_request: Request, { params }: { params: { artistId: string } }) {
  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'non authentifié' }, { status: 401 });
  }

  const config = getAppConfig();
  const response = await fetch(`${config.api.baseUrl}/artists/${params.artistId}/pages`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    return NextResponse.json(await response.json(), { status: response.status });
  }

  const payload = await response.json();
  const pages = Array.isArray(payload) ? payload.map(mapPage) : [];

  return NextResponse.json(pages);
}

export async function POST(request: Request, { params }: { params: { artistId: string } }) {
  const supabase = createSupabaseRouteHandlerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'non authentifié' }, { status: 401 });
  }

  const body = await request.json();
  const config = getAppConfig();

  const response = await fetch(`${config.api.baseUrl}/artists/${params.artistId}/pages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: body.title,
      slug: body.slug,
      seoDescription: body.seoDescription,
      sections: buildDefaultSections(),
      status: body.status ?? 'draft'
    })
  });

  if (!response.ok) {
    return NextResponse.json(await response.json(), { status: response.status });
  }

  trackEvent('builder.page_create', { artistId: params.artistId });
  const payload = await response.json();
  return NextResponse.json(mapPage(payload));
}
