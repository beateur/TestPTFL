import { PageStatusDto, SectionDto } from '../pages/pages.dto';

export interface RuntimeTheme {
  background: string;
  accent: string;
  text: string;
}

export interface RuntimeSection extends SectionDto {
  type:
    | 'hero'
    | 'gallery'
    | 'quote'
    | 'cta'
    | 'stats'
    | 'testimonials'
    | 'contact';
  data: Record<string, any>;
}

export interface RuntimePageFixture {
  id: string;
  title: string;
  slug: string[];
  status: PageStatusDto;
  seoDescription?: string;
  theme: RuntimeTheme;
  sections: RuntimeSection[];
  updatedAt: string;
}

export interface RuntimeNavigationItemFixture {
  label: string;
  slug: string[];
}

export interface RuntimeArtistFixture {
  id: string;
  slug: string;
  displayName: string;
  tagline: string;
  planId: string;
  domain: string;
  theme: RuntimeTheme;
  accentColor: string;
  seoDescription?: string;
  navigation: RuntimeNavigationItemFixture[];
  pages: RuntimePageFixture[];
}

interface RuntimeFixtures {
  artists: RuntimeArtistFixture[];
}

export const runtimeFixtures: RuntimeFixtures = {
  artists: [
    {
      id: 'artist-lys-astrale',
      slug: 'lys-astrale',
      displayName: 'Lys Astrale',
      tagline: 'Surréalismes irisés & lumières numériques',
      planId: 'pro',
      domain: 'lys-astrale.portfolio.local',
      theme: {
        background: 'linear-gradient(120deg, #0d0221 0%, #220135 100%)',
        accent: '#c084fc',
        text: '#f8f7ff'
      },
      accentColor: '#c084fc',
      seoDescription: "Le portfolio immersif de Lys Astrale, artiste numérique et sculptrice de lumière.",
      navigation: [
        { label: 'Accueil', slug: [] },
        { label: 'Galerie', slug: ['galerie'] },
        { label: 'Contact', slug: ['contact'] }
      ],
      pages: [
        {
          id: 'page-lys-home',
          title: 'Univers de Lys Astrale',
          slug: ['lys-astrale'],
          status: PageStatusDto.Published,
          seoDescription: 'Découvrez l’univers onirique de Lys Astrale, artiste numérique parisienne.',
          updatedAt: '2024-05-10T08:00:00.000Z',
          theme: {
            background: 'linear-gradient(140deg, rgba(29, 8, 53, 0.96), rgba(8, 5, 20, 0.98))',
            accent: '#c084fc',
            text: '#f4f0ff'
          },
          sections: [
            {
              type: 'hero',
              data: {
                heading: 'Lys Astrale',
                subheading: 'Immersions numériques & sculptures lumineuses',
                kicker: 'Portfolio officiel'
              }
            },
            {
              type: 'stats',
              data: {
                items: [
                  { label: 'Expositions', value: '24', helper: 'Europe & Asie' },
                  { label: 'Œuvres disponibles', value: '46', helper: 'séries limitées' },
                  { label: 'Collaborations', value: '18', helper: 'studios & marques' }
                ]
              }
            },
            {
              type: 'gallery',
              data: {
                artworks: [
                  { title: 'Spectre Violet', image: '/images/demo-1.jpg' },
                  { title: 'Nébuleuse I', image: '/images/demo-2.jpg' },
                  { title: 'Lumière Liquide', image: '/images/demo-3.jpg' }
                ]
              }
            },
            {
              type: 'quote',
              data: {
                content: 'Chaque installation est un portail vers une émotion lumineuse.',
                author: 'Lys Astrale'
              }
            },
            {
              type: 'cta',
              data: {
                title: 'Découvrir les séries immersives',
                description: 'Téléchargez la brochure media kit et accédez aux tarifs de location.',
                buttonLabel: 'Télécharger le media kit',
                href: 'https://lys-astrale.com/media-kit'
              }
            }
          ]
        },
        {
          id: 'page-lys-gallery',
          title: 'Galerie immersive',
          slug: ['lys-astrale', 'galerie'],
          status: PageStatusDto.Published,
          updatedAt: '2024-05-11T10:10:00.000Z',
          theme: {
            background: 'linear-gradient(160deg, rgba(14, 8, 37, 0.94), rgba(6, 0, 24, 0.98))',
            accent: '#22d3ee',
            text: '#ecfeff'
          },
          sections: [
            {
              type: 'hero',
              data: {
                heading: 'Galerie immersive',
                subheading: 'Une sélection de pièces audiovisuelles modulaires'
              }
            },
            {
              type: 'gallery',
              data: {
                artworks: [
                  { title: 'Echos Prismatiques', image: '/images/demo-4.jpg' },
                  { title: 'Comète', image: '/images/demo-5.jpg' },
                  { title: 'Saturne', image: '/images/demo-6.jpg' },
                  { title: 'Nébuleuse II', image: '/images/demo-7.jpg' }
                ]
              }
            },
            {
              type: 'testimonials',
              data: {
                items: [
                  {
                    quote: 'Une immersion vibrante qui capte l’attention dès les premières secondes.',
                    name: 'Élodie Trintignant',
                    role: 'Curatrice, Nuit Chromatique'
                  },
                  {
                    quote: 'Lys réinvente la scénographie lumineuse avec une précision hypnotique.',
                    name: 'Marc Ayden',
                    role: 'Directeur artistique, VisionLab'
                  }
                ]
              }
            }
          ]
        },
        {
          id: 'page-lys-contact',
          title: 'Collaborer',
          slug: ['lys-astrale', 'contact'],
          status: PageStatusDto.Published,
          updatedAt: '2024-05-12T12:00:00.000Z',
          theme: {
            background: 'linear-gradient(160deg, rgba(13, 4, 29, 0.95), rgba(34, 5, 52, 0.98))',
            accent: '#f97316',
            text: '#fdf2f8'
          },
          sections: [
            {
              type: 'contact',
              data: {
                title: 'Inviter Lys Astrale',
                description: 'Partagez les détails de votre exposition ou collaboration. Réponse sous 48h.'
              }
            }
          ]
        }
      ]
    },
    {
      id: 'artist-atelier-nova',
      slug: 'atelier-nova',
      displayName: 'Atelier Nova',
      tagline: 'Illustrations cosmiques & design sonore',
      planId: 'freemium',
      domain: 'atelier-nova.portfolio.local',
      theme: {
        background: 'linear-gradient(120deg, #05090f 0%, #0c1220 100%)',
        accent: '#38bdf8',
        text: '#f4faff'
      },
      accentColor: '#38bdf8',
      seoDescription: 'Atelier Nova combine illustration numérique et paysages sonores éthérés.',
      navigation: [
        { label: 'Accueil', slug: [] },
        { label: 'Collection', slug: ['collection'] }
      ],
      pages: [
        {
          id: 'page-nova-home',
          title: 'Univers Atelier Nova',
          slug: ['atelier-nova'],
          status: PageStatusDto.Published,
          updatedAt: '2024-05-18T09:30:00.000Z',
          theme: {
            background: 'linear-gradient(180deg, rgba(5, 12, 30, 0.95), rgba(3, 7, 18, 0.98))',
            accent: '#38bdf8',
            text: '#e0f2fe'
          },
          sections: [
            {
              type: 'hero',
              data: {
                heading: 'Atelier Nova',
                subheading: 'Illustrations cosmiques & design sonore',
                kicker: 'Studio indépendant'
              }
            },
            {
              type: 'gallery',
              data: {
                artworks: [
                  { title: 'Pulsar', image: '/images/nova-1.jpg' },
                  { title: 'Marée Astrale', image: '/images/nova-2.jpg' },
                  { title: 'Halo Bleu', image: '/images/nova-3.jpg' }
                ]
              }
            },
            {
              type: 'quote',
              data: {
                content: 'Nous mêlons textures sonores et textures visuelles pour raconter des épopées stellaires.',
                author: 'Atelier Nova'
              }
            }
          ]
        },
        {
          id: 'page-nova-collection',
          title: 'Collection Cosmica',
          slug: ['atelier-nova', 'collection'],
          status: PageStatusDto.Published,
          updatedAt: '2024-05-19T15:45:00.000Z',
          theme: {
            background: 'linear-gradient(150deg, rgba(4, 8, 20, 0.96), rgba(5, 12, 30, 0.98))',
            accent: '#facc15',
            text: '#fefce8'
          },
          sections: [
            {
              type: 'hero',
              data: {
                heading: 'Collection Cosmica',
                subheading: 'Une exploration colorée de constellations imaginaires'
              }
            },
            {
              type: 'gallery',
              data: {
                artworks: [
                  { title: 'Fragment Orbital', image: '/images/nova-4.jpg' },
                  { title: 'Lune Synthétique', image: '/images/nova-5.jpg' },
                  { title: 'Flux Stellaire', image: '/images/nova-6.jpg' }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
};

export function findFixtureArtistByHost(host: string) {
  const normalized = host.replace(/:\d+$/, '').toLowerCase();
  const directMatch = runtimeFixtures.artists.find((artist) => artist.domain === normalized);
  if (directMatch) {
    return directMatch;
  }

  const subdomain = normalized.split('.')[0];
  return runtimeFixtures.artists.find((artist) => artist.slug === subdomain);
}

export function findFixtureArtistByIdOrSlug(identifier: string) {
  return runtimeFixtures.artists.find((artist) => artist.id === identifier || artist.slug === identifier);
}
