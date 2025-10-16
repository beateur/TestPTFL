import { PageDefinition } from '../types';

export async function fetchPagesByArtist(artistId: string): Promise<PageDefinition[]> {
  const response = await fetch(`/api/artists/${artistId}/pages`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Impossible de récupérer les pages');
  }
  return response.json();
}

export interface CreatePagePayload {
  title: string;
  slug: string;
  seoDescription?: string;
}

export async function createPage(artistId: string, payload: CreatePagePayload): Promise<PageDefinition> {
  const response = await fetch(`/api/artists/${artistId}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Impossible de créer la page');
  }

  return response.json();
}

export async function updatePage(pageId: string, payload: Partial<PageDefinition>): Promise<PageDefinition> {
  const response = await fetch(`/api/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Impossible de sauvegarder la page');
  }

  return response.json();
}
