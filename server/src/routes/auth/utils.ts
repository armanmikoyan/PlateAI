import { SignJWT, jwtVerify } from 'jose';

import { AUTH } from '@/routes/auth/constants.js';
import type { AuthUser } from '@/routes/auth/types.js';
import type { ServerConfig } from '@/types.js';

function secretKey(config: ServerConfig): Uint8Array {
  return new TextEncoder().encode(config.JWT_SECRET);
}

export function authCookieOptions(config: ServerConfig) {
  return {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: AUTH.COOKIE_MAX_AGE_MS,
    path: '/',
  };
}

export async function signAuthToken(config: ServerConfig, user: AuthUser): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    image: user.image,
  })
    .setProtectedHeader({ alg: AUTH.JWT_ALG })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(AUTH.JWT_EXPIRY)
    .sign(secretKey(config));
}

export async function verifyAuthToken(config: ServerConfig, token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(config));

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string' || typeof payload.name !== 'string') {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      image: typeof payload.image === 'string' ? payload.image : null,
    };
  } catch {
    return null;
  }
}

export function readAuthTokenFromCookies(cookieHeader: string | undefined): string | null {
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
