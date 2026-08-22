import { Router } from 'express';
import passport from 'passport';

import { getMe, googleCallback, health, logout } from '@/routes/auth/auth-controller.js';
import { AUTH_ROUTES } from '@/routes/auth/constants.js';
import { googleAuthOptions, googleCallbackAuthOptions } from '@/routes/auth/google-oauth.js';
import type { ServerConfig } from '@/types.js';

export function createAuthRouter(config: ServerConfig): Router {
  const router = Router();

  router.get(AUTH_ROUTES.GOOGLE, passport.authenticate('google', googleAuthOptions()));

  router.get(
    AUTH_ROUTES.GOOGLE_CALLBACK,
    passport.authenticate('google', googleCallbackAuthOptions(config)),
    (request, response, next) => {
      googleCallback(config, request, response, next);
    },
  );

  router.get(AUTH_ROUTES.ME, (request, response) => {
    getMe(config, request, response);
  });

  router.get(AUTH_ROUTES.LOGOUT, (request, response) => {
    logout(config, response);
  });

  router.get(AUTH_ROUTES.HEALTH, (request, response) => {
    health(response);
  });

  return router;
}
