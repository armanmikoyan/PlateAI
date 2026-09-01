import type { SubscriptionPlan, SubscriptionStatus } from '@/routes/meal-analyses/constants.js';

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
