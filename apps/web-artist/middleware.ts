import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const API_BASE = process.env.RUNTIME_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

const IGNORE_PATHS = [/^\/(_next|api|unresolved|not-found)/];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (IGNORE_PATHS.some((regex) => regex.test(pathname))) {
    return NextResponse.next();
  }

  const alreadyResolved = request.headers.get('x-runtime-resolved');
  if (alreadyResolved === '1') {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get('host') ?? '';
  if (!hostHeader) {
    return NextResponse.next();
  }

  const normalizedHost = hostHeader.replace(/:\\d+$/, '').toLowerCase();
  const effectiveHost = normalizedHost.includes('localhost') ? 'lys-astrale.portfolio.local' : normalizedHost;

  try {
    const response = await fetch(`${API_BASE}/runtime/resolve?host=${encodeURIComponent(effectiveHost)}`);

    if (!response.ok) {
      throw new Error(`resolve_failed_${response.status}`);
    }

    const payload = await response.json();
    const targetSlug: string = payload?.artist?.slug;

    if (!targetSlug) {
      throw new Error('missing_slug');
    }

    const headers = new Headers(request.headers);
    headers.set('x-runtime-host', effectiveHost);
    headers.set('x-artist-id', payload.artist.id);
    headers.set('x-artist-slug', targetSlug);
    headers.set('x-runtime-resolved', '1');

    const destination = pathname.startsWith(`/${targetSlug}`)
      ? request.nextUrl
      : new URL(`/${targetSlug}${pathname}`, request.url);

    if (destination.href !== request.nextUrl.href) {
      return NextResponse.rewrite(destination, { request: { headers } });
    }

    return NextResponse.next({ request: { headers } });
  } catch (error) {
    await fetch(`${API_BASE}/runtime/events`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ event: 'runtime.resolve_failure', payload: { host: effectiveHost } })
    }).catch(() => undefined);

    return NextResponse.rewrite(new URL('/unresolved', request.url));
  }
}

export const config = {
  matcher: ['/((?!.*\\.\w+$).*)']
};
