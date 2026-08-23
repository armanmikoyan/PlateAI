import {
  SNAP_ANALYSIS_PLANS,
  SUBSCRIPTION_STATUS,
  type SubscriptionPlan,
  type SubscriptionStatus,
} from '@/models/subscription-constants.js';

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
