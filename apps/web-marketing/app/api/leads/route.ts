import { defaultConfig } from '@acme/config';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = defaultConfig.api.baseUrl;

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Requête invalide' }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-store'
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: (data as { message?: string }).message ?? 'Impossible de créer la candidature.' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Erreur API leads', error);
    return NextResponse.json(
      { message: 'Le service de candidature est momentanément indisponible.' },
      { status: 503 }
    );
  }
}
