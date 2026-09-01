import type { NextFunction, Request, Response } from 'express';
import type { UserDocument } from '@/models/user.js';
import { AUTH, AUTH_ERRORS } from '@/routes/auth/constants.js';
import { findUserById } from '@/routes/auth/repository.js';
import { createLoginSession, refreshLoginSession, toAuthUser } from '@/routes/auth/service.js';
import { authCookieOptions } from '@/routes/auth/utils.js';
import type { ServerConfig } from '@/config/types.js';

export async function googleCallback(config: ServerConfig, request: Request, response: Response, next: NextFunction): Promise<void> {
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

export async function getMe(config: ServerConfig, request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const authUser = request.authUser;

    if (!authUser) {
      response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    const document = await findUserById(authUser.id);

    if (!document) {
      response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    response.json({ user: toAuthUser(document) });
  } catch (error) {
    next(error);
  }
}

export function logout(config: ServerConfig, response: Response): void {
  response.clearCookie(AUTH.COOKIE_NAME, authCookieOptions(config));
  response.redirect(`${config.FRONTEND_URL}/`);
}

export async function refreshSession(config: ServerConfig, request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const authUser = request.authUser;

    if (!authUser) {
      response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    const document = await findUserById(authUser.id);

    if (!document) {
      response.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    const session = await refreshLoginSession(config, document);
    response.cookie(AUTH.COOKIE_NAME, session.token, session.cookieOptions);
    response.json({ user: toAuthUser(document) });
  } catch (error) {
    next(error);
  }
}

export function health(response: Response): void {
  response.json({ ok: true });
}
