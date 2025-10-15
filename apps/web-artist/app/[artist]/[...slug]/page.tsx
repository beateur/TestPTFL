import { notFound } from 'next/navigation';
import { fetchArtistPage } from '../../../lib/data';
import { SectionRenderer } from '../../../components/SectionRenderer';

interface ArtistPageProps {
  params: { artist: string; slug: string[] };
}

export default async function ArtistDynamicPage({ params }: ArtistPageProps) {
  const page = await fetchArtistPage(params.artist, params.slug);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <SectionRenderer sections={page.sections} theme={page.theme} />
    </main>
  );
}
