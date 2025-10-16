import { AccountOverview, ArtistSummary } from '../types';

export async function fetchAccountOverview(): Promise<AccountOverview> {
  const response = await fetch('/api/accounts/current', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Impossible de récupérer le compte');
  }
  return response.json();
}

export async function fetchAccountArtists(accountId: string): Promise<ArtistSummary[]> {
  const response = await fetch(`/api/accounts/${accountId}/artists`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Impossible de récupérer les artistes');
  }
  return response.json();
}

