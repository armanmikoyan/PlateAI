import 'dotenv/config';

import express from 'express';
import passport from 'passport';

import { readServerConfig } from '@/config.js';
import { connectDatabase } from '@/db.js';
import { AUTH_ERRORS, AUTH_ROUTES } from '@/routes/auth/constants.js';
import { createAuthRouter } from '@/routes/auth/index.js';
import { configurePassport } from '@/routes/auth/google-oauth.js';

async function main() {
  const config = readServerConfig();

  await connectDatabase(config);
  configurePassport(config);

  const app = express();

  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(passport.initialize());

  app.use(AUTH_ROUTES.MOUNT_PATH, createAuthRouter(config));

  app.use((error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.error(error);
    response.status(500).json({ error: AUTH_ERRORS.SERVER_ERROR });
  });

  app.listen(config.PORT, () => {
    console.log(`Auth server listening on http://127.0.0.1:${config.PORT}`);
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
