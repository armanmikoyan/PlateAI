import express from 'express';
import passport from 'passport';
import { createBillingProvider } from '@plate/plate-billing/provider';
import { AUTH_ERRORS } from '@/routes/auth/constants.js';
import { createAuthRouter } from '@/routes/auth/index.js';
import { configurePassport } from '@/routes/auth/google-oauth.js';
import { createCheckoutSessionRouter, createCheckoutWebhookRouter } from '@/routes/checkout/index.js';
import { toBillingProviderConfig } from '@/routes/checkout/utils.js';
import { createHealthRouter } from '@/routes/health/index.js';
import { createMealAnalysesRouter } from '@/routes/meal-analyses/index.js';
import type { ServerConfig } from '@/config/types.js';

export function createApp(config: ServerConfig): express.Express {
  configurePassport(config);

  const app = express();
  app.set('trust proxy', 1);

  const billing = createBillingProvider(toBillingProviderConfig(config));

  // Webhook signatures require the raw body, so parse it before the global JSON parser.
  app.use('/webhook', express.raw({ type: 'application/json' }));
  app.use(express.json());

  app.use('/health', createHealthRouter());

  app.use(passport.initialize());
  app.use('/auth', createAuthRouter(config));
  app.use('/meal-analyses', createMealAnalysesRouter(config));
  app.use('/checkout', createCheckoutSessionRouter(config, billing));
  app.use('/webhook', createCheckoutWebhookRouter(billing));

  app.use(
    (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
      void next;
      console.error(error, request.url);
      response.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
    },
  );

  return app;
}
