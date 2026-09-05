import { describe, expect, it } from 'vitest';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@plate/plate-billing/constants';
import {
  canAnalyzeToday,
  formatDailyLimitReachedMessage,
  hasSnapAnalysisAccess,
  isSnapAnalysisLocked,
} from './utils.js';

describe('snap analysis entitlements', () => {
  it('grants access to active basic, pro, and individual plans', () => {
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.BASIC,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ).toBe(true);
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.PRO,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ).toBe(true);
    expect(
      hasSnapAnalysisAccess({
        subscriptionPlan: SUBSCRIPTION_PLAN.INDIVIDUAL,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      }),
    ).toBe(true);
  });

  it('denies untracked subscriptions', () => {
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

describe('canAnalyzeToday', () => {
  it('allows basic plan up to 3 analyses', () => {
    expect(canAnalyzeToday(0, SUBSCRIPTION_PLAN.BASIC)).toBe(true);
    expect(canAnalyzeToday(2, SUBSCRIPTION_PLAN.BASIC)).toBe(true);
    expect(canAnalyzeToday(3, SUBSCRIPTION_PLAN.BASIC)).toBe(false);
    expect(canAnalyzeToday(5, SUBSCRIPTION_PLAN.BASIC)).toBe(false);
  });

  it('allows pro plan up to 15 analyses', () => {
    expect(canAnalyzeToday(0, SUBSCRIPTION_PLAN.PRO)).toBe(true);
    expect(canAnalyzeToday(14, SUBSCRIPTION_PLAN.PRO)).toBe(true);
    expect(canAnalyzeToday(15, SUBSCRIPTION_PLAN.PRO)).toBe(false);
    expect(canAnalyzeToday(20, SUBSCRIPTION_PLAN.PRO)).toBe(false);
  });

  it('allows individual plan up to 15 analyses', () => {
    expect(canAnalyzeToday(0, SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(true);
    expect(canAnalyzeToday(14, SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(true);
    expect(canAnalyzeToday(15, SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(false);
  });

  it('denies analyses for null plan', () => {
    expect(canAnalyzeToday(0, null)).toBe(false);
  });
});

describe('formatDailyLimitReachedMessage', () => {
  it('interpolates the used and limit counts', () => {
    expect(formatDailyLimitReachedMessage(3, 3)).toBe(
      'Daily analysis limit reached — 3 of 3 used today. New analyses unlock after midnight (UTC).',
    );
    expect(formatDailyLimitReachedMessage(7, 15)).toBe(
      'Daily analysis limit reached — 7 of 15 used today. New analyses unlock after midnight (UTC).',
    );
  });
});
