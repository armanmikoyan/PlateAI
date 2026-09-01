import type { SubscriptionPlan, SubscriptionStatus } from '@/app/api/auth/constants';

export type AuthUser = Readonly<{
  id: string;
  email: string;
  name: string;
  image: string | null;
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
}>;

export type AuthMeResponse = Readonly<{
  user: AuthUser;
}>;

export type AuthErrorResponse = Readonly<{
  error: string;
}>;
