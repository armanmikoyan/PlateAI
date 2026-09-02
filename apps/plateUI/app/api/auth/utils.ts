import { jwtVerify } from 'jose';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@plate/plate-billing/constants';
import type { SubscriptionPlan, SubscriptionStatus } from '@plate/plate-billing/types';
import { AUTH } from '@/app/api/auth/constants';
import type { AuthMeResponse, AuthUser } from '@/app/api/auth/types';

export function readJwtSecret(env: NodeJS.ProcessEnv = process.env): string {
  const secret = env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET is required.');
  }

  return secret;
}

export function readAuthServerUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.AUTH_SERVER_URL?.trim() || 'http://127.0.0.1:4000';
}

const SUBSCRIPTION_PLAN_VALUES: readonly SubscriptionPlan[] = Object.values(SUBSCRIPTION_PLAN);
const SUBSCRIPTION_STATUS_VALUES: readonly SubscriptionStatus[] = Object.values(SUBSCRIPTION_STATUS);

function nullableSubscriptionPlan(value: unknown): SubscriptionPlan | null {
  return typeof value === 'string' && (SUBSCRIPTION_PLAN_VALUES as readonly string[]).includes(value)
    ? (value as SubscriptionPlan)
    : null;
}

function nullableSubscriptionStatus(value: unknown): SubscriptionStatus | null {
  return typeof value === 'string' && (SUBSCRIPTION_STATUS_VALUES as readonly string[]).includes(value)
    ? (value as SubscriptionStatus)
    : null;
}

function readAuthTokenFromCookieHeader(cookieHeader: string | null): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const separatorIndex = trimmed.indexOf('=');

    if (separatorIndex === -1) {
      continue;
    }

    const name = trimmed.slice(0, separatorIndex);
    const value = trimmed.slice(separatorIndex + 1);

    if (name === AUTH.COOKIE_NAME) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

export async function verifyAuthToken(token: string): Promise<AuthUser | null> {
  try {
    const secret = new TextEncoder().encode(readJwtSecret());
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string'
    ) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: typeof payload.image === 'string' ? payload.image : null,
      subscriptionPlan: nullableSubscriptionPlan(payload.subscriptionPlan),
      subscriptionStatus: nullableSubscriptionStatus(payload.subscriptionStatus),
      subscriptionRenewsAt:
        typeof payload.subscriptionRenewsAt === 'string' ? payload.subscriptionRenewsAt : null,
      subscriptionEndsAt: typeof payload.subscriptionEndsAt === 'string' ? payload.subscriptionEndsAt : null,
    };
  } catch {
    return null;
  }
}

export async function getAuthSession(cookieHeader: string | null): Promise<AuthUser | null> {
  try {
    const token = readAuthTokenFromCookieHeader(cookieHeader);

    if (!token) {
      return null;
    }

    return verifyAuthToken(token);
  } catch {
    return null;
  }
}

export async function fetchAuthUser(cookieHeader: string | null): Promise<AuthUser | null> {
  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${readAuthServerUrl()}/auth/me`, {
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

export async function proxyToAuthServer(request: Request, upstreamPath: string): Promise<Response> {
  const requestUrl = new URL(request.url);
  const targetUrl = `${readAuthServerUrl()}${upstreamPath}${requestUrl.search}`;

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
    return Response.json({ error: 'Auth server unavailable.' }, { status: 502 });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstreamResponseHeaders(upstream),
  });
}
