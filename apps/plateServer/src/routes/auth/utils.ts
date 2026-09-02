import { createHash, randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify } from 'jose';
import { AUTH } from '@/routes/auth/constants.js';
import type { AccessTokenClaims } from '@/routes/auth/types.js';
import type { ServerConfig } from '@/config/types.js';

function secretKey(config: ServerConfig): Uint8Array {
  return new TextEncoder().encode(config.JWT_SECRET);
}

function readCookie(cookieHeader: string | undefined, name: string): string | null {
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

export function readAccessTokenFromCookies(cookieHeader: string | undefined): string | null {
  return readCookie(cookieHeader, AUTH.ACCESS_COOKIE_NAME);
}

export function readRefreshTokenFromCookies(cookieHeader: string | undefined): string | null {
  return readCookie(cookieHeader, AUTH.REFRESH_COOKIE_NAME);
}

export function accessCookieOptions(config: ServerConfig) {
  return {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: AUTH.ACCESS_TOKEN_TTL_MS,
    path: '/',
  };
}

export function refreshCookieOptions(config: ServerConfig) {
  return {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: AUTH.REFRESH_TOKEN_TTL_MS,
    path: '/',
  };
}

export async function signAccessToken(
  config: ServerConfig,
  userId: string,
  sessionId: string,
  user: { email: string; name: string },
): Promise<string> {
  return new SignJWT({
    email: user.email,
    name: user.name,
    sid: sessionId,
  })
    .setProtectedHeader({ alg: AUTH.JWT_ALG })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${AUTH.ACCESS_TOKEN_TTL_MS / 1000}s`)
    .sign(secretKey(config));
}

export async function verifyAccessToken(
  config: ServerConfig,
  token: string,
): Promise<AccessTokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey(config));

    if (typeof payload.sub !== 'string' || typeof payload.sid !== 'string') {
      return null;
    }

    return {
      sub: payload.sub,
      sid: payload.sid,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      name: typeof payload.name === 'string' ? payload.name : undefined,
    };
  } catch {
    return null;
  }
}

export function generateRefreshToken(): string {
  return randomBytes(AUTH.REFRESH_TOKEN_BYTES).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHash(AUTH.REFRESH_HASH_ALG).update(token).digest('hex');
}
