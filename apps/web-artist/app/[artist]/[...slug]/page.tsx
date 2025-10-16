import { headers } from 'next/headers';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPublishedPage, resolveTenant } from '../../../lib/data';
import { SectionRenderer } from '../../../components/SectionRenderer';
import { RuntimePageViewTracker } from '../../../components/RuntimePageViewTracker';

interface ArtistDynamicPageProps {
  params: { artist: string; slug: string[] };
}

async function loadRuntimeContext(artistSlug: string) {
  const headerList = headers();
  const host = headerList.get('x-runtime-host') ?? headerList.get('host') ?? `${artistSlug}.portfolio.local`;
  const runtime = await resolveTenant(host);

  if (runtime.artist.slug !== artistSlug) {
    throw new Error('artist_mismatch');
  }

  return runtime;
}

export async function generateMetadata({ params }: ArtistDynamicPageProps): Promise<Metadata> {
  try {
    const runtime = await loadRuntimeContext(params.artist);
    const page = await fetchPublishedPage({
      artistId: runtime.artist.id,
      artistSlug: runtime.artist.slug,
      slugSegments: params.slug
    });

    if (!page) {
      return { title: runtime.artist.displayName };
    }

    const description = page.seoDescription ?? runtime.artist.seoDescription ?? runtime.artist.tagline;
    const path = params.slug.join('/');

    return {
      title: `${page.title} — ${runtime.artist.displayName}`,
      description,
      openGraph: {
        title: `${page.title} — ${runtime.artist.displayName}`,
        description,
        url: `https://${runtime.artist.slug}.portfolio.local/${path}`,
        type: 'article'
      }
    };
  } catch {
    return { title: 'Portfolio' };
  }
}

export default async function ArtistDynamicPage({ params }: ArtistDynamicPageProps) {
  try {
    const runtime = await loadRuntimeContext(params.artist);
    const page = await fetchPublishedPage({
      artistId: runtime.artist.id,
      artistSlug: runtime.artist.slug,
      slugSegments: params.slug
    });

    if (!page) {
      notFound();
    }

    return (
      <>
        <RuntimePageViewTracker artistId={runtime.artist.id} pageId={page.id} slug={page.slug} />
        <main id="main">
          <SectionRenderer
            sections={page.sections}
            theme={page.theme}
            accentColor={runtime.artist.accentColor}
            contactEnabled={runtime.plan.contactEnabled}
            artist={{ id: runtime.artist.id, name: runtime.artist.displayName }}
          />
        </main>
      </>
    );
  } catch {
    notFound();
  }
}
