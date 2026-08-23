import type { SubscriptionPlan, SubscriptionStatus } from '@/lib/billing/constants';

export type UserSubscription = Readonly<{
  PLAN: SubscriptionPlan | null;
  STATUS: SubscriptionStatus | null;
}>;
