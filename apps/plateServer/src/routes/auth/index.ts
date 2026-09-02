import { Router } from 'express';
import passport from 'passport';
import {
  getMe,
  googleCallback,
  health,
  logout,
  refreshSession,
} from '@/routes/auth/controller.js';
import { googleAuthOptions, googleCallbackAuthOptions } from '@/routes/auth/google-oauth.js';
import { requireUser } from '@/middleware/require-user.js';
import type { ServerConfig } from '@/config/types.js';

export function createAuthRouter(config: ServerConfig): Router {
  const router = Router();
  const authenticated = requireUser(config);

  router.get('/google', passport.authenticate('google', googleAuthOptions()));

  router.get(
    '/google/callback',
    passport.authenticate('google', googleCallbackAuthOptions(config)),
    (request, response, next) => {
      googleCallback(config, request, response, next);
    },
  );

  router.get('/me', authenticated, (request, response) => {
    getMe(request, response);
  });

  router.get('/refresh', (request, response, next) => {
    refreshSession(config, request, response, next);
  });

  router.get('/logout', (request, response) => {
    logout(config, request, response);
  });

  router.get('/health', (request, response) => {
    health(response);
  });

  return router;
}
