import type { NextFunction, Request, Response } from 'express';
import type { UserDocument } from '@/models/user.js';
import { AUTH, AUTH_ERRORS } from '@/routes/auth/constants.js';
import { createLoginSession, rotateSession, terminateSession } from '@/routes/auth/service.js';
import { readRefreshTokenFromCookies } from '@/routes/auth/utils.js';
import type { ServerConfig } from '@/config/types.js';

export async function googleCallback(
  config: ServerConfig,
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = request.user as UserDocument | undefined;

    if (!user) {
      response.redirect(`${config.FRONTEND_URL}/login?error=google`);
      return;
    }

    const session = await createLoginSession(config, user, {
      userAgent: request.get('user-agent') ?? null,
      ipAddress: request.ip ?? null,
    });

    response.cookie(AUTH.ACCESS_COOKIE_NAME, session.accessToken, session.accessCookieOptions);
    response.cookie(AUTH.REFRESH_COOKIE_NAME, session.refreshToken, session.refreshCookieOptions);
    response.redirect(`${config.FRONTEND_URL}/snap`);
  } catch (error) {
    next(error);
  }
}

export async function getMe(request: Request, response: Response): Promise<void> {
  const authUser = request.authUser;

  if (!authUser) {
    response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
    return;
  }

  response.json({ user: authUser });
}

export function logout(config: ServerConfig, request: Request, response: Response): void {
  const refreshToken = readRefreshTokenFromCookies(request.headers.cookie);

  terminateSession(refreshToken ?? '').catch(() => undefined);

  response.clearCookie(AUTH.ACCESS_COOKIE_NAME, { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
  response.clearCookie(AUTH.REFRESH_COOKIE_NAME, { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: 'lax', path: '/' });
  response.redirect(`${config.FRONTEND_URL}/`);
}

export async function refreshSession(
  config: ServerConfig,
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const refreshToken = readRefreshTokenFromCookies(request.headers.cookie);

    if (!refreshToken) {
      response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    const session = await rotateSession(config, refreshToken);

    if (!session) {
      response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    response.cookie(AUTH.ACCESS_COOKIE_NAME, session.accessToken, session.accessCookieOptions);
    response.cookie(AUTH.REFRESH_COOKIE_NAME, session.refreshToken, session.refreshCookieOptions);
    response.json({ user: session.user });
  } catch (error) {
    next(error);
  }
}

export function health(response: Response): void {
  response.json({ ok: true });
}
