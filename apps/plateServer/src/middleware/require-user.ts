import type { Request, Response, NextFunction } from 'express';
import { AUTH_ERRORS } from '@/routes/auth/constants.js';
import { resolveActiveSession, toAuthUser } from '@/routes/auth/service.js';
import type { AuthUser } from '@/routes/auth/types.js';
import { readAccessTokenFromCookies, verifyAccessToken } from '@/routes/auth/utils.js';
import type { ServerConfig } from '@/config/types.js';

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

export function requireUser(config: ServerConfig) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = readAccessTokenFromCookies(req.headers.cookie);

    if (!token) {
      res.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    const claims = await verifyAccessToken(config, token);

    if (!claims) {
      res.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    const { session, user } = await resolveActiveSession(claims.sid);

    if (!session || !user) {
      res.status(401).json({ error: AUTH_ERRORS.NOT_SIGNED_IN });
      return;
    }

    req.authUser = toAuthUser(user);
    next();
  };
}
