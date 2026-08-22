export function readJwtSecret(env: NodeJS.ProcessEnv = process.env): string {
  const secret = env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET is required.');
  }

  return secret;
}

export function readAuthServerUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.AUTH_SERVER_URL?.trim() || 'http://127.0.0.1:4000';
}
