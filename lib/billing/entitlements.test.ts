import { describe, expect, it } from 'vitest';

import {
  SUBSCRIPTION_PLAN,
  SUBSCRIPTION_STATUS,
} from '@/lib/billing/constants';
import { hasSnapAnalysisAccess, isSnapAnalysisLocked } from '@/lib/billing/entitlements';

describe('hasSnapAnalysisAccess', () => {
  it('grants access for active plus and pro plans', () => {
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

  it('denies access when subscription plan or status is null', () => {
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: null,
        subscriptionStatus: null,
      }),
    ).toBe(false);

    expect(
      isSnapAnalysisLocked({
        subscriptionPlan: null,
        subscriptionStatus: null,
      }),
    ).toBe(true);

    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.PLUS,
        subscriptionStatus: null,
      }),
    ).toBe(false);
  });

  it('denies access for basic even when active', () => {
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.BASIC,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ).toBe(false);
  });
});
