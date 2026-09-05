export const SUBSCRIPTION_PLAN = {
  BASIC: 'basic',
  PRO: 'pro',
  INDIVIDUAL: 'individual',
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export const DAILY_ANALYSIS_LIMITS = {
  [SUBSCRIPTION_PLAN.BASIC]: 3,
  [SUBSCRIPTION_PLAN.PRO]: 15,
  [SUBSCRIPTION_PLAN.INDIVIDUAL]: 15,
} as const;

export const PLAN_RANK = {
  [SUBSCRIPTION_PLAN.BASIC]: 1,
  [SUBSCRIPTION_PLAN.PRO]: 2,
  [SUBSCRIPTION_PLAN.INDIVIDUAL]: 3,
} as const;
