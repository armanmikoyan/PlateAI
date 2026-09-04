import type { SubscriptionPlan, SubscriptionStatus } from '@plate/plate-billing/types';

export const MEAL_ANALYSIS_ERRORS = {
  NOT_SIGNED_IN: 'Not signed in.',
  NOT_FOUND: 'Meal analysis not found.',
  INVALID_BODY: 'Invalid request body.',
  SERVER_ERROR: 'Could not save meal analysis.',
  LOCKED: 'Paid plan required to analyze this meal.',
  DAILY_LIMIT_REACHED: 'Daily analysis limit reached. Upgrade your plan for more.',
  CANNOT_COMPLETE: 'This meal analysis cannot be completed.',
  AI_NOT_CONFIGURED: 'Meal analysis is not configured on this server.',
  AI_FAILED: 'Could not analyze that photo. Try a clearer shot.',
  AI_UNKNOWN: 'Something went wrong while analyzing the photo.',
} as const;

export type SubscriptionEntitlementInput = Readonly<{
  subscriptionPlan: SubscriptionPlan | null;
  subscriptionStatus: SubscriptionStatus | null;
}>;
