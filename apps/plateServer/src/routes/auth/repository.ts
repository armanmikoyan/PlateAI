import { Types } from 'mongoose';
import { Session, type SessionDocument } from '@/models/session.js';
import { User, type UserDocument } from '@/models/user.js';

export async function findUserById(id: string): Promise<UserDocument | null> {
  return User.findById(id).exec();
}

export async function upsertUserByGoogleProfile(
  profile: { googleId: string; email: string; name: string; image: string | null },
): Promise<UserDocument | null> {
  return User.findOneAndUpdate(
    { googleId: profile.googleId },
    {
      email: profile.email,
      name: profile.name,
      image: profile.image,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).exec();
}

export async function createSession(input: {
  userId: Types.ObjectId;
  refreshTokenHash: string;
  expiresAt: Date;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<SessionDocument> {
  const [session] = await Session.create([
    {
      userId: input.userId,
      refreshTokenHash: input.refreshTokenHash,
      expiresAt: input.expiresAt,
      lastUsedAt: new Date(),
      userAgent: input.userAgent ?? null,
      ipAddress: input.ipAddress ?? null,
    },
  ]);

  return session;
}

export async function findSessionByRefreshHash(refreshTokenHash: string): Promise<SessionDocument | null> {
  return Session.findOne({ refreshTokenHash }).exec();
}

export async function findActiveSessionById(sessionId: string): Promise<SessionDocument | null> {
  if (!Types.ObjectId.isValid(sessionId)) {
    return null;
  }

  return Session.findOne({
    _id: new Types.ObjectId(sessionId),
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  }).exec();
}

export async function updateSessionRefreshToken(input: {
  sessionId: string;
  refreshTokenHash: string;
  expiresAt: Date;
}): Promise<SessionDocument | null> {
  return Session.findByIdAndUpdate(
    new Types.ObjectId(input.sessionId),
    {
      refreshTokenHash: input.refreshTokenHash,
      expiresAt: input.expiresAt,
      lastUsedAt: new Date(),
    },
    { new: true },
  ).exec();
}

export async function revokeSession(sessionId: string): Promise<void> {
  await Session.findByIdAndUpdate(new Types.ObjectId(sessionId), { revokedAt: new Date() }).exec();
}

export async function revokeSessionByRefreshHash(refreshTokenHash: string): Promise<void> {
  await Session.updateOne({ refreshTokenHash }, { revokedAt: new Date() }).exec();
}
