import { Router } from 'express';
import { contactRateLimiter } from '@/middleware/rate-limit.js';
import { requireUser } from '@/middleware/require-user.js';
import { createContactHandler } from '@/routes/contact/controller.js';
import type { ServerConfig } from '@/config/types.js';

export function createContactRouter(config: ServerConfig): Router {
  const router = Router();
  const authenticated = requireUser(config);
  const handle = createContactHandler(config);

  router.post('/', authenticated, contactRateLimiter(), handle);

  return router;
}
