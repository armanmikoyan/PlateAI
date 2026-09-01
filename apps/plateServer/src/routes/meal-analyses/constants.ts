export const MEAL_ANALYSIS_STATUS = {
  PENDING: 'pending',
  DONE: 'done',
  FAILED: 'failed',
} as const;

export type MealAnalysisStatus = (typeof MEAL_ANALYSIS_STATUS)[keyof typeof MEAL_ANALYSIS_STATUS];

export const MEAL_ANALYSIS_CONFIDENCE = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type MealAnalysisConfidence =
  (typeof MEAL_ANALYSIS_CONFIDENCE)[keyof typeof MEAL_ANALYSIS_CONFIDENCE];

export const MEAL_ANALYSIS_ERRORS = {
  NOT_SIGNED_IN: 'Not signed in.',
  NOT_FOUND: 'Meal analysis not found.',
  INVALID_BODY: 'Invalid request body.',
  SERVER_ERROR: 'Could not save meal analysis.',
  LOCKED: 'Paid plan required to analyze this meal.',
  CANNOT_COMPLETE: 'This meal analysis cannot be completed.',
  AI_NOT_CONFIGURED: 'Meal analysis is not configured on this server.',
  AI_FAILED: 'Could not analyze that photo. Try a clearer shot.',
  AI_UNKNOWN: 'Something went wrong while analyzing the photo.',
} as const;

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

/** Plans that unlock photo-based snap analysis (Basic is manual logging only). */
export const SNAP_ANALYSIS_PLANS: readonly SubscriptionPlan[] = [
  SUBSCRIPTION_PLAN.PLUS,
  SUBSCRIPTION_PLAN.PRO,
] as const;

export type UserSubscription = Readonly<{
  PLAN: SubscriptionPlan | null;
  STATUS: SubscriptionStatus | null;
}>;

export type SubscriptionEntitlementInput = Readonly<{
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
}>;
