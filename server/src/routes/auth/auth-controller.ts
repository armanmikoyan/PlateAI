import type { NextFunction, Request, Response } from 'express';

import { AUTH, AUTH_ERRORS } from '@/routes/auth/constants.js';
import { createLoginSession, getAuthenticatedUser } from '@/routes/auth/auth-service.js';
import { authCookieOptions } from '@/routes/auth/utils.js';
import type { UserDocument } from '@/models/user.js';
import type { ServerConfig } from '@/types.js';

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

    const session = await createLoginSession(config, user);
    response.cookie(AUTH.COOKIE_NAME, session.token, session.cookieOptions);
    response.redirect(`${config.FRONTEND_URL}/snap`);
  } catch (error) {
    next(error);
  }
}

export async function getMe(config: ServerConfig, request: Request, response: Response): Promise<void> {
  const user = await getAuthenticatedUser(config, request.headers.cookie);

  if (!user) {
    response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
    return;
  }

  response.json({ user });
}

export function logout(config: ServerConfig, response: Response): void {
  response.clearCookie(AUTH.COOKIE_NAME, authCookieOptions(config));
  response.redirect(`${config.FRONTEND_URL}/`);
}

export function health(response: Response): void {
  response.json({ ok: true });
}
