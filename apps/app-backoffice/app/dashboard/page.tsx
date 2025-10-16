import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../lib/supabase/server';
import { AccountProvider } from './AccountProvider';
import { DashboardShell } from './DashboardShell';

export const metadata = {
  title: 'Tableau de bord — Lumina Studio'
};

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <AccountProvider>
      <DashboardShell />
    </AccountProvider>
  );
}

