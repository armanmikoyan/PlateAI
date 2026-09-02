import type { SubscriptionPlan, SubscriptionStatus } from '@plate/plate-billing/types';

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
