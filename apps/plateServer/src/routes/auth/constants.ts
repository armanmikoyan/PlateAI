export const AUTH = {
  ACCESS_COOKIE_NAME: 'plateai.access',
  REFRESH_COOKIE_NAME: 'plateai.refresh',
  JWT_ALG: 'HS256',
  ACCESS_TOKEN_TTL_MS: 1000 * 60 * 15,
  REFRESH_TOKEN_TTL_MS: 1000 * 60 * 60 * 24 * 30,
  REFRESH_TOKEN_BYTES: 32,
  REFRESH_HASH_ALG: 'sha256',
} as const;

export const AUTH_GOOGLE = {
  SCOPES: ['profile', 'email'],
} as const;

export const AUTH_ERRORS = {
  NOT_SIGNED_IN: 'Not signed in.',
  SERVER_ERROR: 'Auth server error.',
  GOOGLE_NO_EMAIL: 'Google account did not return an email address.',
  USER_UPSERT_FAILED: 'Could not create or load user.',
} as const;
