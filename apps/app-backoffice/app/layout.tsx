import './globals.css';
import { ReactNode } from 'react';
import { createSupabaseServerClient } from '../lib/supabase/server';
import { Providers } from '../providers';

export const metadata = {
  title: 'Lumina Studio - Back-office',
  description: 'Administrez vos portfolios, médias et statistiques depuis une interface unifiée.'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return (
    <html lang="fr">
      <body>
        <Providers initialSession={session}>{children}</Providers>
      </body>
    </html>
  );
}
