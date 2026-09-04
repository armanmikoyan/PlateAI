import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@plate/plate-billing/constants';
import type { SubscriptionPlan, SubscriptionStatus } from '@plate/plate-billing/types';

export const MEAL_HISTORY = {
  TITLE: 'Meal analyses',
  SUBTITLE: 'Pending meals stay here after you snap a plate. Upgrade, then tap Analyze to finish.',
  EMPTY_TITLE: 'No saved meals yet',
  EMPTY_BODY: 'Snap a plate while signed in and your photo will appear here until analysis is complete.',
  EMPTY_CTA: 'Snap a plate',
  EMPTY_CTA_HREF: '/snap',
  STATUS_PENDING: 'Pending',
  STATUS_DONE: 'Done',
  STATUS_FAILED: 'Failed',
  ANALYZE_PENDING: 'Analyze meal',
  VIEW_RESULTS: 'View results',
  RETRY: 'Try again',
  SAVED_AT: 'Saved',
  MEAL_PREVIEW_ALT: 'Saved meal photo',
  LOAD_ERROR: 'Could not load meal history.',
  PLAN_SYNC_ERROR: 'Your plan is still updating, but your meals are available below.',
  REMOVE_PENDING_ARIA: 'Remove pending meal',
  REMOVE_ERROR: 'Could not remove that meal.',
  PENDING_COUNT_LABEL: 'pending',
  PLAN_LABEL: 'Your plan',
  PLAN_CTA: 'View plans',
  PLAN_CTA_HREF: '/pricing',
  PLAN_RENEWS_ON: 'Renews',
  PLAN_ACCESS_UNTIL: 'Access until',
} as const;

export const MEAL_HISTORY_PLAN_LABELS: Record<SubscriptionPlan, string> = {
  [SUBSCRIPTION_PLAN.BASIC]: 'Basic',
  [SUBSCRIPTION_PLAN.PRO]: 'Pro',
  [SUBSCRIPTION_PLAN.INDIVIDUAL]: 'Individual',
};

export const MEAL_HISTORY_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SUBSCRIPTION_STATUS.ACTIVE]: 'Active',
  [SUBSCRIPTION_STATUS.CANCELLED]: 'Cancelled',
  [SUBSCRIPTION_STATUS.EXPIRED]: 'Expired',
};
