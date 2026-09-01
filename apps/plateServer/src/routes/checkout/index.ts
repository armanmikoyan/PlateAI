import { Router } from 'express';
import express from 'express';
import { requireUser } from '@/middleware/require-user.js';
import { createCheckoutSession, handleWebhook } from '@/routes/checkout/controller.js';
import type { ServerConfig } from '@/config/types.js';

export function createCheckoutSessionRouter(config: ServerConfig): Router {
  const router = Router();
  const authenticated = requireUser(config);

  router.post('/session', express.json(), authenticated, (request, response, next) => {
    createCheckoutSession(config, request, response, next);
  });

  return router;
}

export function createCheckoutWebhookRouter(config: ServerConfig): Router {
  const router = Router();

  router.post('/', express.raw({ type: 'application/json' }), (request, response, next) => {
    handleWebhook(config, request, response, next);
  });

  return router;
}
