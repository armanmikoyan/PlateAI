import 'dotenv/config';

import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';

import { readServerConfig } from '@/config.js';
import { AUTH_ERRORS, AUTH_ROUTES } from '@/routes/auth/constants.js';
import { createAuthRouter } from '@/routes/auth/index.js';
import { configurePassport } from '@/routes/auth/google-oauth.js';
import {
  MEAL_ANALYSIS_JSON_LIMIT,
  MEAL_ANALYSIS_ROUTES,
} from '@/routes/meal-analyses/constants.js';
import { createMealAnalysesRouter } from '@/routes/meal-analyses/index.js';
import { createPaymentRouter } from '@/routes/payment/index.js';
import { PAYMENT_ROUTES } from '@/routes/payment/constants.js';

async function main() {
  const config = readServerConfig();

  await mongoose.connect(config.MONGODB_URI);
  console.log('Connected to MongoDB');

  configurePassport(config);

  const app = express();

  app.set('trust proxy', 1);
  app.use(express.json({ limit: MEAL_ANALYSIS_JSON_LIMIT }));
  app.use(passport.initialize());

  app.use(AUTH_ROUTES.MOUNT_PATH, createAuthRouter(config));
  app.use(MEAL_ANALYSIS_ROUTES.MOUNT_PATH, createMealAnalysesRouter(config));
  app.use(`${PAYMENT_ROUTES.MOUNT_PATH}`, createPaymentRouter(config));

  app.use((error: Error, request: express.Request, response: express.Response, next) => {
    console.error(error);
    response.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  });

  app.listen(config.PORT, '0.0.0.0', () => {
    console.log(`Auth server listening on http://127.0.0.1:${config.PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
