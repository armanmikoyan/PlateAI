import { describe, expect, it } from 'vitest';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@plate/plate-billing/constants';
import {
  canAnalyzeToday,
  canSavePendingAnalysis,
  formatDailyLimitReachedMessage,
  formatPendingLimitReachedMessage,
  hasSnapAnalysisAccess,
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
});

describe('canAnalyzeToday', () => {
  it('allows basic plan up to 10 analyses', () => {
    expect(canAnalyzeToday(0, SUBSCRIPTION_PLAN.BASIC)).toBe(true);
    expect(canAnalyzeToday(9, SUBSCRIPTION_PLAN.BASIC)).toBe(true);
    expect(canAnalyzeToday(10, SUBSCRIPTION_PLAN.BASIC)).toBe(false);
    expect(canAnalyzeToday(12, SUBSCRIPTION_PLAN.BASIC)).toBe(false);
  });

  it('allows pro plan up to 50 analyses', () => {
    expect(canAnalyzeToday(0, SUBSCRIPTION_PLAN.PRO)).toBe(true);
    expect(canAnalyzeToday(49, SUBSCRIPTION_PLAN.PRO)).toBe(true);
    expect(canAnalyzeToday(50, SUBSCRIPTION_PLAN.PRO)).toBe(false);
    expect(canAnalyzeToday(60, SUBSCRIPTION_PLAN.PRO)).toBe(false);
  });

  it('allows individual plan unlimited analyses', () => {
    expect(canAnalyzeToday(0, SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(true);
    expect(canAnalyzeToday(100_000, SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(true);
  });

  it('denies analyses for null plan', () => {
    expect(canAnalyzeToday(0, null)).toBe(false);
  });
});

describe('canSavePendingAnalysis', () => {
  it('allows free users up to 3 pending analyses', () => {
    expect(canSavePendingAnalysis(0, null)).toBe(true);
    expect(canSavePendingAnalysis(2, null)).toBe(true);
    expect(canSavePendingAnalysis(3, null)).toBe(false);
    expect(canSavePendingAnalysis(5, null)).toBe(false);
  });

  it('allows paid plans up to 10 pending analyses', () => {
    expect(canSavePendingAnalysis(9, SUBSCRIPTION_PLAN.BASIC)).toBe(true);
    expect(canSavePendingAnalysis(10, SUBSCRIPTION_PLAN.BASIC)).toBe(false);
    expect(canSavePendingAnalysis(9, SUBSCRIPTION_PLAN.PRO)).toBe(true);
    expect(canSavePendingAnalysis(10, SUBSCRIPTION_PLAN.PRO)).toBe(false);
    expect(canSavePendingAnalysis(9, SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(true);
    expect(canSavePendingAnalysis(10, SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(false);
  });
});

describe('formatPendingLimitReachedMessage', () => {
  it('interpolates the limit count', () => {
    expect(formatPendingLimitReachedMessage(3)).toBe(
      'Pending analysis limit reached — you have 3 saved. Analyze or clear pending photos to upload more.',
    );
    expect(formatPendingLimitReachedMessage(10)).toBe(
      'Pending analysis limit reached — you have 10 saved. Analyze or clear pending photos to upload more.',
    );
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
