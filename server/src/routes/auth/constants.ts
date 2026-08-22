export const AUTH = {
  COOKIE_NAME: 'plateai.token',
  JWT_EXPIRY: '30d',
  JWT_ALG: 'HS256',
  COOKIE_MAX_AGE_MS: 1000 * 60 * 60 * 24 * 30,
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

export const AUTH_ROUTES = {
  MOUNT_PATH: '/auth',
  GOOGLE: '/google',
  GOOGLE_CALLBACK: '/google/callback',
  ME: '/me',
  LOGOUT: '/logout',
  HEALTH: '/health',
} as const;
