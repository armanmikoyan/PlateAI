export const SUBSCRIPTION_PLAN = {
  BASIC: 'basic',
  PLUS: 'plus',
  PRO: 'pro',
} as const;

export type SubscriptionPlan = (typeof SUBSCRIPTION_PLAN)[keyof typeof SUBSCRIPTION_PLAN];

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export function isPaidPlan(plan: string | null | undefined): plan is Exclude<SubscriptionPlan, 'basic'> {
  return plan === SUBSCRIPTION_PLAN.PLUS || plan === SUBSCRIPTION_PLAN.PRO;
}

export function isActivePaidPlan(plan: SubscriptionPlan | null, status: SubscriptionStatus | null): boolean {
  return isPaidPlan(plan) && status === SUBSCRIPTION_STATUS.ACTIVE;
}

export type CheckoutSessionResponse = Readonly<{
  url: string;
}>;

export type CheckoutErrorResponse = Readonly<{
  error: string;
}>;
