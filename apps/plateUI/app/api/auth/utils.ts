import { AUTH } from '@/app/api/auth/constants';
import type { AuthMeResponse, AuthUser } from '@/app/api/auth/types';

export function readPlateServerUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.PLATE_SERVER_URL?.trim() || 'http://127.0.0.1:4000';
}

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    if (trimmed.slice(0, separatorIndex) === name) {
      return decodeURIComponent(trimmed.slice(separatorIndex + 1));
    }
  }

  return null;
}

export function readAccessTokenFromCookieHeader(cookieHeader: string | null): string | null {
  return readCookie(cookieHeader, AUTH.ACCESS_COOKIE_NAME);
}

export function readRefreshTokenFromCookieHeader(cookieHeader: string | null): string | null {
  return readCookie(cookieHeader, AUTH.REFRESH_COOKIE_NAME);
}

export async function fetchAuthUser(cookieHeader: string | null): Promise<AuthUser | null> {
  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${readPlateServerUrl()}/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AuthMeResponse;
    return payload.user ?? null;
  } catch {
    return null;
  }
}

export function getAuthSession(cookieHeader: string | null): Promise<AuthUser | null> {
  return fetchAuthUser(cookieHeader);
}

function upstreamResponseHeaders(upstream: Response): Headers {
  const headers = new Headers();

  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      return;
    }
    headers.set(key, value);
  });

  const setCookies = upstream.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      headers.append('set-cookie', cookie);
    }
  } else {
    const cookie = upstream.headers.get('set-cookie');
    if (cookie) {
      headers.append('set-cookie', cookie);
    }
  }

  return headers;
}

export async function proxyToApiServer(request: Request, upstreamPath: string): Promise<Response> {
  const requestUrl = new URL(request.url);
  const targetUrl = `${readPlateServerUrl()}${upstreamPath}${requestUrl.search}`;

  const headers = new Headers();
  const cookie = request.headers.get('cookie');

  if (cookie) {
    headers.set('cookie', cookie);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  let upstream: Response;

  try {
    upstream = await fetch(targetUrl, init);
  } catch {
    return Response.json({ error: 'Unable to reach our servers right now. Please try again in a moment.' }, { status: 502 });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstreamResponseHeaders(upstream),
  });
}
