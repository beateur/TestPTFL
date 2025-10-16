import 'server-only';

import { cache } from 'react';
import { getRuntimeApiBaseUrl } from './config';

export interface RuntimeTheme {
  background: string;
  accent: string;
  text: string;
}

export interface RuntimeNavigationItem {
  label: string;
  slug: string[];
  href: string;
}

export type RuntimeSection =
  | { type: 'hero'; data: { heading: string; subheading?: string; kicker?: string } }
  | { type: 'gallery'; data: { artworks: { title: string; image?: string }[] } }
  | { type: 'quote'; data: { content: string; author: string } }
  | { type: 'cta'; data: { title: string; description?: string; buttonLabel: string; href: string } }
  | { type: 'stats'; data: { items: { label: string; value: string; helper?: string }[] } }
  | { type: 'testimonials'; data: { items: { quote: string; name: string; role?: string }[] } }
  | { type: 'contact'; data: { title: string; description?: string } };

export interface RuntimePage {
  id: string;
  title: string;
  slug: string[];
  theme: RuntimeTheme;
  seoDescription?: string | null;
  sections: RuntimeSection[];
  updatedAt: string;
}

export interface RuntimeArtist {
  id: string;
  slug: string;
  displayName: string;
  tagline: string;
  planId: string;
  theme: RuntimeTheme;
  accentColor: string;
  seoDescription?: string;
}

export interface RuntimePlan {
  id: string;
  name: string;
  price: number;
  pageLimit: number | null;
  storageLimitMb: number;
  contactEnabled: boolean;
  collaborators?: string;
}

export interface RuntimeResolution {
  artist: RuntimeArtist;
  navigation: RuntimeNavigationItem[];
  plan: RuntimePlan;
  pages: { id: string; title: string; slug: string[]; updatedAt: string }[];
  revalidateSeconds: number;
}

async function runtimeFetch<T>(input: string, init?: RequestInit, revalidateSeconds = 60): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(init?.headers ?? {})
    },
    next: { revalidate: revalidateSeconds }
  });

  if (!response.ok) {
    throw new Error(`Runtime API error: ${response.status}`);
  }

  return response.json();
}

export const resolveTenant = cache(async (host: string) => {
  const baseUrl = getRuntimeApiBaseUrl();
  const url = new URL('/runtime/resolve', baseUrl);
  url.searchParams.set('host', host);
  return runtimeFetch<RuntimeResolution>(url.toString());
});

interface FetchPageOptions {
  artistId: string;
  artistSlug: string;
  slugSegments: string[];
}

export const fetchPublishedPage = cache(async ({ artistId, artistSlug, slugSegments }: FetchPageOptions) => {
  const baseUrl = getRuntimeApiBaseUrl();
  const url = new URL(`/artists/${artistId}/pages`, baseUrl);
  url.searchParams.set('status', 'published');
  url.searchParams.set('includeSections', 'true');

  const pages = await runtimeFetch<any[]>(url.toString());
  const normalizedSlug = slugSegments.join('/');

  const match = pages.find((page) => {
    const fullSlug: string[] = page.full_slug ?? [artistSlug, page.slug].filter(Boolean);
    const relative = fullSlug.slice(1).join('/');
    return relative === normalizedSlug;
  });

  const fallbackHome = !normalizedSlug && pages.find((page) => {
    const fullSlug: string[] = page.full_slug ?? [artistSlug, page.slug].filter(Boolean);
    return fullSlug.length <= 1;
  });

  const page = match ?? fallbackHome;

  if (!page) {
    return null;
  }

  const sections: RuntimeSection[] = (page.sections ?? []).map((section: any) => ({
    type: section.type,
    data: section.data ?? {}
  }));

  return {
    id: page.id as string,
    title: page.title as string,
    slug: (page.full_slug ?? [artistSlug, page.slug]).filter(Boolean) as string[],
    theme: (page.theme ?? page.sections?.theme) ?? {
      background: 'linear-gradient(180deg, #05010a 0%, #140b2d 100%)',
      accent: '#7c3aed',
      text: '#ffffff'
    },
    seoDescription: page.seo_description ?? null,
    sections,
    updatedAt: page.updated_at ?? new Date().toISOString()
  } satisfies RuntimePage;
});
