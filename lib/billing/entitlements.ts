import {
  SNAP_ANALYSIS_PLANS,
  SUBSCRIPTION_STATUS,
  type SubscriptionPlan,
  type SubscriptionStatus,
} from '@/lib/billing/constants';
import type { UserSubscription } from '@/lib/billing/types';

type SubscriptionEntitlementInput = Readonly<{
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
}>;

export function hasSnapAnalysisAccess(subscription: SubscriptionEntitlementInput): boolean {
  const { subscriptionPlan, subscriptionStatus } = subscription;

  if (subscriptionPlan === null || subscriptionStatus === null) {
    return false;
  }

  return (
    SNAP_ANALYSIS_PLANS.includes(subscriptionPlan) &&
    subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE
  );
}

export function isSnapAnalysisLocked(subscription: SubscriptionEntitlementInput): boolean {
  return !hasSnapAnalysisAccess(subscription);
}

export function toUserSubscription(subscription: SubscriptionEntitlementInput): UserSubscription {
  return {
    PLAN: subscription.subscriptionPlan,
    STATUS: subscription.subscriptionStatus,
  };
}
