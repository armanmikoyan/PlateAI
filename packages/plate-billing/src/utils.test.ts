import { describe, expect, it } from 'vitest';
import { SUBSCRIPTION_PLAN } from '@/constants.js';
import { getPendingAnalysisLimit, isPlanUpgrade } from './utils.js';

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