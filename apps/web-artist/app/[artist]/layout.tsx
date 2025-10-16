import { ReactNode } from 'react';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { resolveTenant } from '../../lib/data';
import { RuntimeNavigation } from '../../components/RuntimeNavigation';

interface ArtistLayoutProps {
  children: ReactNode;
  params: { artist: string };
}

export default async function ArtistLayout({ children, params }: ArtistLayoutProps) {
  const headerList = headers();
  const host = headerList.get('x-runtime-host') ?? headerList.get('host') ?? `${params.artist}.portfolio.local`;

  try {
    const runtime = await resolveTenant(host);
    if (runtime.artist.slug !== params.artist) {
      notFound();
    }

    const lastUpdatedTimestamp = runtime.pages.reduce((latest, page) => {
      const timestamp = Date.parse(page.updatedAt ?? '');
      if (Number.isNaN(timestamp)) {
        return latest;
      }
      return Math.max(latest, timestamp);
    }, 0);

    const lastUpdated = new Date(lastUpdatedTimestamp || Date.now()).toLocaleDateString('fr-FR');

    return (
      <>
        <a href="#main" className="skip-link">
          Aller au contenu principal
        </a>
        <RuntimeNavigation
          navigation={runtime.navigation}
          accentColor={runtime.artist.accentColor}
          artist={{ slug: runtime.artist.slug, displayName: runtime.artist.displayName, tagline: runtime.artist.tagline }}
        />
        {children}
        <footer className="runtime-footer" aria-label="Informations complémentaires">
          <div className="runtime-footer__inner">
            <span>{runtime.artist.displayName}</span>
            <span>Plan {runtime.plan.name}</span>
            <span>Dernière mise à jour : {lastUpdated}</span>
          </div>
        </footer>
      </>
    );
  } catch {
    notFound();
  }
}
