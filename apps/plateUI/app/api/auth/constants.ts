export const AUTH = {
  COOKIE_NAME: 'plateai.token',
} as const;

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
