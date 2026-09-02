import { Router } from 'express';
import { requireUser } from '@/middleware/require-user.js';
import { createCheckoutSessionHandler, createWebhookHandler } from '@/routes/checkout/controller.js';
import type { BillingProvider } from '@plate/plate-billing/types';
import type { ServerConfig } from '@/config/types.js';

export function createCheckoutSessionRouter(config: ServerConfig, billing: BillingProvider): Router {
  const router = Router();
  const authenticated = requireUser(config);
  const handle = createCheckoutSessionHandler(billing, config);

  router.post('/session', authenticated, handle);

  return router;
}

export function createCheckoutWebhookRouter(billing: BillingProvider): Router {
  const router = Router();
  const handle = createWebhookHandler(billing);

  router.post('/', handle);

  return router;
}
