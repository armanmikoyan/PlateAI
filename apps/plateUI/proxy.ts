import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  getAuthSession,
  mergeRefreshedCookies,
  readPlateServerUrl,
} from '@/app/api/auth/utils';

type SessionCheck = Readonly<{
  ok: boolean;
  setCookies: readonly string[];
}>;

function loginRedirect(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

async function refreshSession(cookieHeader: string | null): Promise<Response | null> {
  if (!cookieHeader) {
    return null;
  }

  try {
    return await fetch(`${readPlateServerUrl()}/auth/refresh`, {
      method: 'GET',
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}

async function checkSession(cookieHeader: string | null): Promise<SessionCheck> {
  if (await getAuthSession(cookieHeader)) {
    return { ok: true, setCookies: [] };
  }

  const refreshed = await refreshSession(cookieHeader);

  if (!refreshed?.ok) {
    return { ok: false, setCookies: [] };
  }

  return { ok: true, setCookies: refreshed.headers.getSetCookie?.() ?? [] };
}

export async function proxy(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie');
  const session = await checkSession(cookieHeader);

  if (session.ok) {
    if (session.setCookies.length === 0) {
      return NextResponse.next();
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', mergeRefreshedCookies(cookieHeader, session.setCookies) ?? '');

    const response = NextResponse.next({ request: { headers: requestHeaders } });

    for (const cookie of session.setCookies) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  }

  if (
    request.nextUrl.pathname.startsWith('/api/snap/') ||
    request.nextUrl.pathname.startsWith('/api/meal-analyses')
  ) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  return loginRedirect(request);
}

export const config = {
  matcher: [
    '/snap',
    '/snap/:path*',
    '/history',
    '/history/:path*',
    '/api/snap/:path*',
    '/api/meal-analyses/:path*',
  ],
};
