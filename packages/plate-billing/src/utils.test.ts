import { describe, expect, it } from 'vitest';
import { SUBSCRIPTION_PLAN } from '@/constants.js';
import {
  getDailyAnalysisLimit,
  getPendingAnalysisLimit,
  hasUnlimitedDailyAnalyses,
  isPlanUpgrade,
} from './utils.js';

describe('isPlanUpgrade', () => {
  it('is false when there is no current plan', () => {
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.BASIC, null)).toBe(false);
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.PRO, null)).toBe(false);
  });

  it('orders basic < pro < individual', () => {
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.PRO, SUBSCRIPTION_PLAN.BASIC)).toBe(true);
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.INDIVIDUAL, SUBSCRIPTION_PLAN.BASIC)).toBe(true);
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.INDIVIDUAL, SUBSCRIPTION_PLAN.PRO)).toBe(true);
  });

  it('rejects the same or lower tiers', () => {
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.BASIC, SUBSCRIPTION_PLAN.BASIC)).toBe(false);
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.BASIC, SUBSCRIPTION_PLAN.PRO)).toBe(false);
    expect(isPlanUpgrade(SUBSCRIPTION_PLAN.PRO, SUBSCRIPTION_PLAN.PRO)).toBe(false);
  });
});

describe('getDailyAnalysisLimit', () => {
  it('returns 0 for free users', () => {
    expect(getDailyAnalysisLimit(null)).toBe(0);
  });

  it('returns 10 for basic and 50 for pro', () => {
    expect(getDailyAnalysisLimit(SUBSCRIPTION_PLAN.BASIC)).toBe(10);
    expect(getDailyAnalysisLimit(SUBSCRIPTION_PLAN.PRO)).toBe(50);
  });

  it('is infinite for individual', () => {
    expect(getDailyAnalysisLimit(SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(Infinity);
  });
});

describe('hasUnlimitedDailyAnalyses', () => {
  it('is true only for individual', () => {
    expect(hasUnlimitedDailyAnalyses(null)).toBe(false);
    expect(hasUnlimitedDailyAnalyses(SUBSCRIPTION_PLAN.BASIC)).toBe(false);
    expect(hasUnlimitedDailyAnalyses(SUBSCRIPTION_PLAN.PRO)).toBe(false);
    expect(hasUnlimitedDailyAnalyses(SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(true);
  });
});

describe('getPendingAnalysisLimit', () => {
  it('allows free users up to 3 pending analyses', () => {
    expect(getPendingAnalysisLimit(null)).toBe(3);
  });

  it('allows all paid plans up to 10 pending analyses', () => {
    expect(getPendingAnalysisLimit(SUBSCRIPTION_PLAN.BASIC)).toBe(10);
    expect(getPendingAnalysisLimit(SUBSCRIPTION_PLAN.PRO)).toBe(10);
    expect(getPendingAnalysisLimit(SUBSCRIPTION_PLAN.INDIVIDUAL)).toBe(10);
  });
});
