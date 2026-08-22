import type { UserDocument } from '@/models/user.js';
import type { AuthUser } from '@/routes/auth/types.js';
import {
  authCookieOptions,
  readAuthTokenFromCookies,
  signAuthToken,
  verifyAuthToken,
} from '@/routes/auth/utils.js';
import type { ServerConfig } from '@/types.js';

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image ?? null,
  };
}

export async function getAuthenticatedUser(
  config: ServerConfig,
  cookieHeader: string | undefined,
): Promise<AuthUser | null> {
  const token = readAuthTokenFromCookies(cookieHeader);

  if (!token) {
    return null;
  }

  return verifyAuthToken(config, token);
}

export async function createLoginSession(
  config: ServerConfig,
  user: UserDocument,
): Promise<{ token: string; cookieOptions: ReturnType<typeof authCookieOptions> }> {
  const token = await signAuthToken(config, toAuthUser(user));

  return {
    token,
    cookieOptions: authCookieOptions(config),
  };
}
