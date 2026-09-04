import { DAILY_ANALYSIS_LIMITS, SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/constants.js';
import type { SubscriptionPlan, SubscriptionStatus } from '@/types.js';

export function isPaidPlan(plan: string | null | undefined): plan is SubscriptionPlan {
  return plan === SUBSCRIPTION_PLAN.BASIC || plan === SUBSCRIPTION_PLAN.PRO || plan === SUBSCRIPTION_PLAN.INDIVIDUAL;
}

export function isPurchasablePlan(plan: string | null | undefined): plan is Exclude<SubscriptionPlan, 'individual'> {
  return plan === SUBSCRIPTION_PLAN.BASIC || plan === SUBSCRIPTION_PLAN.PRO;
}

export function isActivePaidPlan(plan: SubscriptionPlan | null, status: SubscriptionStatus | null): boolean {
  return isPaidPlan(plan) && status === SUBSCRIPTION_STATUS.ACTIVE;
}

export function getDailyAnalysisLimit(plan: SubscriptionPlan | null): number {
  if (!plan) {
    return 0;
  }
  return DAILY_ANALYSIS_LIMITS[plan] ?? 0;
}
