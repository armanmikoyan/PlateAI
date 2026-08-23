import { jwtVerify } from 'jose';
import { AUTH } from '@/lib/auth/constants';
import { readJwtSecret } from '@/lib/auth/config';
import type { AuthUser } from '@/lib/auth/types';

export function readAuthTokenFromCookieHeader(cookieHeader: string | null): string | null {
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

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string' || typeof payload.name !== 'string') {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: typeof payload.image === 'string' ? payload.image : null,
      subscriptionPlan: null,
      subscriptionStatus: null,
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
