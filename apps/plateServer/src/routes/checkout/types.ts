import type { SubscriptionPlan, SubscriptionStatus } from '@plate/plate-billing/types';

export type CreateCheckoutOutcome = Readonly<{
  url?: string;
  error?: string;
}>;

export type ApplySubscriptionUpdate = Readonly<{
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  billingCustomerId?: string;
  billingOrderId?: string;
  billingSubscriptionId?: string;
  subscriptionRenewsAt?: string | null;
  subscriptionEndsAt?: string | null;
}>;
