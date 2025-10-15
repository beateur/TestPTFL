import './globals.css';
import { ReactNode } from 'react';
import { Providers } from '../providers';

export const metadata = {
  title: 'Lumina Portfolios',
  description: 'Plateforme SaaS pour portfolios d\'artistes'
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
