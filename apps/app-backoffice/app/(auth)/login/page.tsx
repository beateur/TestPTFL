import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../lib/supabase/server';
import { LoginView } from './LoginView';

export const metadata: Metadata = {
  title: 'Connexion — Lumina Studio'
};

export default async function LoginPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    redirect('/dashboard');
  }

  return <LoginView />;
}

