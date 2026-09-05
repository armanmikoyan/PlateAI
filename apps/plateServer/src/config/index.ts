import type { ServerConfig } from './types.js';

const MONGODB_URI_TEMPLATE = /\$\{([^}]+)\}/g;

function requiredEnv(name: string, value: string | undefined): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new Error(`${name} is required.`);
  }

  return trimmed;
}

function readMongoDbUri(env: NodeJS.ProcessEnv): string {
  const template = env.MONGODB_URI?.trim();

  if (!template) {
    throw new Error('MONGODB_URI is required.');
  }

  return template.replace(MONGODB_URI_TEMPLATE, (match, name: string) => {
    const key = name.trim();
    const value = env[key]?.trim();

    if (!value) {
      throw new Error(`${key} is required for MONGODB_URI.`);
    }

    return encodeURIComponent(value);
  });
}

export function readServerConfig(env: NodeJS.ProcessEnv = process.env): ServerConfig {
  const port = Number.parseInt(env.PORT?.trim() ?? '4000', 10);

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('PORT must be a positive number.');
  }

  return {
    PORT: port,
    MONGODB_URI: readMongoDbUri(env),
    JWT_SECRET: requiredEnv('JWT_SECRET', env.JWT_SECRET),
    GOOGLE_CLIENT_ID: requiredEnv('GOOGLE_CLIENT_ID', env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: requiredEnv('GOOGLE_CLIENT_SECRET', env.GOOGLE_CLIENT_SECRET),
    GOOGLE_CALLBACK_URL: env.GOOGLE_CALLBACK_URL?.trim() || 'http://localhost:3000/api/auth/google/callback',
    FRONTEND_URL: env.FRONTEND_URL?.trim() || 'http://localhost:3000',
    NODE_ENV: env.NODE_ENV?.trim() ?? 'development',
    LEMON_SQUEEZY_API_KEY: requiredEnv('LEMON_SQUEEZY_API_KEY', env.LEMON_SQUEEZY_API_KEY),
    LEMON_SQUEEZY_WEBHOOK_SECRET: requiredEnv(
      'LEMON_SQUEEZY_WEBHOOK_SECRET',
      env.LEMON_SQUEEZY_WEBHOOK_SECRET,
    ),
    LEMON_SQUEEZY_STORE_ID: requiredEnv('LEMON_SQUEEZY_STORE_ID', env.LEMON_SQUEEZY_STORE_ID),
    LEMON_SQUEEZY_VARIANT_ID_BASIC: requiredEnv(
      'LEMON_SQUEEZY_VARIANT_ID_BASIC',
      env.LEMON_SQUEEZY_VARIANT_ID_BASIC,
    ),
    LEMON_SQUEEZY_VARIANT_ID_PRO: requiredEnv(
      'LEMON_SQUEEZY_VARIANT_ID_PRO',
      env.LEMON_SQUEEZY_VARIANT_ID_PRO,
    ),
    LEMON_SQUEEZY_TEST_MODE: env.LEMON_SQUEEZY_TEST_MODE?.trim() === '1',
    EMAIL_HOST: env.EMAIL_HOST?.trim() ?? 'smtp.gmail.com',
    EMAIL_PORT: Number.parseInt(env.EMAIL_PORT?.trim() ?? '465', 10),
    EMAIL_USER: requiredEnv('EMAIL_USER', env.EMAIL_USER),
    EMAIL_PASS: requiredEnv('EMAIL_PASS', env.EMAIL_PASS),
  };
}
