import express from 'express';
import passport from 'passport';
import { createBillingProvider } from '@plate/plate-billing/provider';
import { APP_ERRORS } from '@/app/constants.js';
import { createAuthRouter } from '@/routes/auth/index.js';
import { configurePassport } from '@/routes/auth/google-oauth.js';
import { createCheckoutSessionRouter, createCheckoutWebhookRouter } from '@/routes/checkout/index.js';
import { toBillingProviderConfig } from '@/routes/checkout/utils.js';
import { createContactRouter } from '@/routes/contact/index.js';
import { createHealthRouter } from '@/routes/health/index.js';
import { createMealAnalysesRouter } from '@/routes/meal-analyses/index.js';
import { requestLogger } from '@/middleware/request-logger.js';
import { security } from '@/middleware/security.js';
import type { ServerConfig } from '@/config/types.js';

export function createApp(config: ServerConfig): express.Express {
  const app = express();
  const billing = createBillingProvider(toBillingProviderConfig(config));

  configurePassport(config);
  app.use(passport.initialize());

  app.set('trust proxy', 1);

  app.use(requestLogger(config));
  app.use(security(config));

  app.use('/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json({ limit: '10mb' }));

  app.use('/health', createHealthRouter());
  app.use('/auth', createAuthRouter(config));
  app.use('/meal-analyses', createMealAnalysesRouter(config));
  app.use('/checkout', createCheckoutSessionRouter(config, billing));
  app.use('/webhook', createCheckoutWebhookRouter(billing));
  app.use('/contact', createContactRouter(config));

  app.use(
    (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
      void next;
      console.error(error, request.url);
      response.status(500).json({ error: APP_ERRORS.SERVER_ERROR });
    },
  );

  return app;
}
