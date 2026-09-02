import type { Types } from 'mongoose';
import type { UserDocument } from '@/models/user.js';
import type { SessionDocument } from '@/models/session.js';
import { AUTH } from '@/routes/auth/constants.js';
import {
  createSession,
  findActiveSessionById,
  findSessionByRefreshHash,
  findUserById,
  revokeSessionByRefreshHash,
  updateSessionRefreshToken,
} from '@/routes/auth/repository.js';
import type { AuthUser } from '@/routes/auth/types.js';
import {
  accessCookieOptions,
  generateRefreshToken,
  hashRefreshToken,
  refreshCookieOptions,
  signAccessToken,
} from '@/routes/auth/utils.js';
import type { ServerConfig } from '@/config/types.js';

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image ?? null,
    subscriptionPlan: user.subscriptionPlan ?? null,
    subscriptionStatus: user.subscriptionStatus ?? null,
    subscriptionRenewsAt: user.subscriptionRenewsAt ?? null,
    subscriptionEndsAt: user.subscriptionEndsAt ?? null,
  };
}

export type LoginSessionResult = Readonly<{
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  accessCookieOptions: ReturnType<typeof accessCookieOptions>;
  refreshCookieOptions: ReturnType<typeof refreshCookieOptions>;
}>;

function refreshExpiresAt(): Date {
  return new Date(Date.now() + AUTH.REFRESH_TOKEN_TTL_MS);
}

export async function createLoginSession(
  config: ServerConfig,
  user: UserDocument,
  device: { userAgent?: string | null; ipAddress?: string | null },
): Promise<LoginSessionResult> {
  const refreshToken = generateRefreshToken();
  const expiresAt = refreshExpiresAt();

  const session = await createSession({
    userId: user._id as Types.ObjectId,
    refreshTokenHash: hashRefreshToken(refreshToken),
    expiresAt,
    userAgent: device.userAgent,
    ipAddress: device.ipAddress,
  });

  const sessionId = session._id.toString();
  const accessToken = await signAccessToken(config, user._id.toString(), sessionId, {
    email: user.email,
    name: user.name,
  });

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken,
    accessCookieOptions: accessCookieOptions(config),
    refreshCookieOptions: refreshCookieOptions(config),
  };
}

export async function rotateSession(
  config: ServerConfig,
  currentRefreshToken: string,
): Promise<LoginSessionResult | null> {
  const session = await findSessionByRefreshHash(hashRefreshToken(currentRefreshToken));

  if (!session) {
    return null;
  }

  const now = Date.now();

  if (session.revokedAt || session.expiresAt.getTime() <= now) {
    return null;
  }

  const user = await findUserById(session.userId.toString());

  if (!user) {
    return null;
  }

  const nextRefreshToken = generateRefreshToken();
  const nextExpiresAt = refreshExpiresAt();

  const updated = await updateSessionRefreshToken({
    sessionId: session._id.toString(),
    refreshTokenHash: hashRefreshToken(nextRefreshToken),
    expiresAt: nextExpiresAt,
  });

  if (!updated) {
    return null;
  }

  const accessToken = await signAccessToken(config, user._id.toString(), session._id.toString(), {
    email: user.email,
    name: user.name,
  });

  return {
    user: toAuthUser(user),
    accessToken,
    refreshToken: nextRefreshToken,
    accessCookieOptions: accessCookieOptions(config),
    refreshCookieOptions: refreshCookieOptions(config),
  };
}

export async function terminateSession(currentRefreshToken: string): Promise<void> {
  if (!currentRefreshToken) {
    return;
  }

  await revokeSessionByRefreshHash(hashRefreshToken(currentRefreshToken));
}

export type ActiveSession = Readonly<{ session: SessionDocument | null; user: UserDocument | null }>;

export async function resolveActiveSession(sessionId: string): Promise<ActiveSession> {
  const session = await findActiveSessionById(sessionId);

  if (!session) {
    return { session: null, user: null };
  }

  const user = await findUserById(session.userId.toString());
  return { session, user };
}
