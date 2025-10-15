import { notFound } from 'next/navigation';
import { fetchArtistConfig } from '../../lib/data';
import { HeroSection } from '../../components/HeroSection';
import { GallerySection } from '../../components/GallerySection';

interface ArtistPageProps {
  params: { artist: string };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artist = await fetchArtistConfig(params.artist);

  if (!artist) {
    notFound();
  }

  return (
    <main>
      <HeroSection artist={artist} />
      <GallerySection artworks={artist.featuredArtworks} />
    </main>
  );
}
