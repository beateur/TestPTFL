import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../providers';

export const metadata = {
  title: 'Lumina Studio - Back-office',
  description: 'Administrez vos portfolios, médias et statistiques depuis une interface unifiée.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
