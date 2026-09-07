import type { SubscriptionPlan, SubscriptionStatus } from '@plate/plate-billing/types';
import type { SessionDocument } from '@/models/session.js';
import type { UserDocument } from '@/models/user.js';

export type AuthUser = Readonly<{
  id: string;
  email: string;
  name: string;
  image: string | null;
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
  subscriptionRenewsAt: string | null;
  subscriptionEndsAt: string | null;
}>;

export type AuthMeResponse = Readonly<{
  user: AuthUser;
}>;

export type AuthErrorResponse = Readonly<{
  error: string;
}>;

export type SessionTokens = Readonly<{
  accessToken: string;
  refreshToken: string;
}>;

export type AccessTokenClaims = Readonly<{
  sub: string;
  sid: string;
  email?: string;
  name?: string;
}>;

export type ActiveSession = Readonly<{ session: SessionDocument | null; user: UserDocument | null }>;
