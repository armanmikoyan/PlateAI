import type { UserDocument } from '@/models/user.js';
import type { AuthUser } from '@/routes/auth/types.js';
import { authCookieOptions, signAuthToken } from '@/routes/auth/utils.js';
import type { ServerConfig } from '@/config/types.js';

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image ?? null,
    subscriptionPlan: user.subscriptionPlan ?? null,
    subscriptionStatus: user.subscriptionStatus ?? null,
  };
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
