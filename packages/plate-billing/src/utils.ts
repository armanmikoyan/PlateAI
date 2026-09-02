import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/constants.js';
import type { SubscriptionPlan, SubscriptionStatus } from '@/types.js';

export function isPaidPlan(plan: string | null | undefined): plan is Exclude<SubscriptionPlan, 'basic'> {
  return plan === SUBSCRIPTION_PLAN.PLUS || plan === SUBSCRIPTION_PLAN.PRO;
}

export function isActivePaidPlan(plan: SubscriptionPlan | null, status: SubscriptionStatus | null): boolean {
  return isPaidPlan(plan) && status === SUBSCRIPTION_STATUS.ACTIVE;
}
