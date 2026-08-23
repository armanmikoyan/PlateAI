export const SUBSCRIPTION_PLAN = {
  BASIC: 'basic',
  PLUS: 'plus',
  PRO: 'pro',
} as const;

export type SubscriptionPlan = (typeof SUBSCRIPTION_PLAN)[keyof typeof SUBSCRIPTION_PLAN];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
} as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

/** Plans that unlock photo-based snap analysis (Basic is manual logging only). */
export const SNAP_ANALYSIS_PLANS: readonly SubscriptionPlan[] = [
  SUBSCRIPTION_PLAN.PLUS,
  SUBSCRIPTION_PLAN.PRO,
] as const;
