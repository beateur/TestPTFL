import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { AccountProvider } from '../AccountProvider';
import { PageBuilderShell } from './PageBuilderShell';

export const metadata = {
  title: 'Page Builder — Lumina Studio'
};

export default async function PageBuilderPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <AccountProvider>
      <PageBuilderShell />
    </AccountProvider>
  );
}
