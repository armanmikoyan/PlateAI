import { describe, expect, it } from 'vitest';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@plate/plate-billing';
import { hasSnapAnalysisAccess, isSnapAnalysisLocked } from './utils.js';

describe('snap analysis entitlements', () => {
  it('grants access to active plus and pro plans', () => {
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.PLUS,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ).toBe(true);
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.PRO,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ).toBe(true);
  });

  it('denies basic and untracked subscriptions', () => {
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.BASIC,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ).toBe(false);

    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: null,
        subscriptionStatus: null,
      }),
    ).toBe(false);
  });

  it('isSnapAnalysisLocked is the inverse of hasSnapAnalysisAccess', () => {
    const input = {
      subscriptionPlan: SUBSCRIPTION_PLAN.PRO,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    };

    expect(isSnapAnalysisLocked(input)).toBe(!hasSnapAnalysisAccess(input));
  });
});
