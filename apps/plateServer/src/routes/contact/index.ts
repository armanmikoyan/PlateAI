import { Router } from 'express';
import { createContactHandler } from '@/routes/contact/controller.js';
import type { EmailConfig } from '@/config/types.js';

export function createContactRouter(config: EmailConfig): Router {
  const router = Router();
  const handle = createContactHandler(config);

  router.post('/', handle);

  return router;
}
