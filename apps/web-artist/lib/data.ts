interface ArtistConfig {
  slug: string;
  name: string;
  tagline: string;
  featuredArtworks: Artwork[];
  theme: ThemeTokens;
}

interface Artwork {
  title: string;
  image: string;
}

interface ThemeTokens {
  background: string;
  accent: string;
  text: string;
}

interface PageDefinition {
  slug: string[];
  sections: SectionDefinition[];
  theme: ThemeTokens;
}

type SectionDefinition =
  | { type: 'hero'; title: string; description: string }
  | { type: 'gallery'; artworks: Artwork[] }
  | { type: 'quote'; content: string; author: string }
  | { type: 'cta'; title: string; buttonLabel: string; href: string };

const mockArtists: ArtistConfig[] = [
  {
    slug: 'demo',
    name: 'Lys Astrale',
    tagline: 'Surréalismes irisés & lumières numériques',
    featuredArtworks: [
      { title: 'Spectre Violet', image: '/images/demo-1.jpg' },
      { title: 'Nébuleuse I', image: '/images/demo-2.jpg' },
      { title: 'Lumière Liquide', image: '/images/demo-3.jpg' }
    ],
    theme: {
      background: 'radial-gradient(circle at 20% 20%, rgba(91, 33, 182, 0.5), rgba(10, 10, 30, 0.95))',
      accent: '#9a6bff',
      text: '#f5f3ff'
    }
  }
];

const mockPages: PageDefinition[] = [
  {
    slug: ['demo'],
    sections: [
      { type: 'hero', title: 'Univers de Lys Astrale', description: 'Immersions chromatiques et rêves liquides.' },
      {
        type: 'gallery',
        artworks: [
          { title: 'Echos Prismatiques', image: '/images/demo-4.jpg' },
          { title: 'Comète', image: '/images/demo-5.jpg' },
          { title: 'Saturne', image: '/images/demo-6.jpg' }
        ]
      },
      { type: 'quote', content: 'Chaque œuvre est un portail vers une émotion lumineuse.', author: 'Lys Astrale' },
      { type: 'cta', title: 'Demander une collaboration', buttonLabel: 'Écrire', href: '/contact' }
    ],
    theme: {
      background: 'linear-gradient(120deg, rgba(26, 14, 46, 0.95), rgba(4, 4, 12, 0.98))',
      accent: '#a855f7',
      text: '#ffffff'
    }
  }
];

export async function fetchArtistConfig(slug: string) {
  return mockArtists.find((artist) => artist.slug === slug) ?? null;
}

export async function fetchArtistPage(artistSlug: string, slug: string[]) {
  const fullSlug = [artistSlug, ...slug].join('/');
  return mockPages.find((page) => page.slug.join('/') === fullSlug) ?? null;
}

export type { ArtistConfig, PageDefinition, SectionDefinition, ThemeTokens, Artwork };
