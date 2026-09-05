import { describe, expect, it } from 'vitest';
import { MEAL_ANALYSIS_STATUS } from '@plate/plate-ai/constants';
import type { MealAnalysisSummary } from '@plate/plate-ai/types';
import { analysesCountToday, pendingMealCount } from './utils';

const item = (createdAt: string, status: string): MealAnalysisSummary => ({
  id: createdAt,
  createdAt,
  status: status as MealAnalysisSummary['status'],
  imageMimeType: 'image/jpeg',
  imageBase64: 'fixture',
  analysis: null,
  errorMessage: null,
  updatedAt: createdAt,
});

describe('analysesCountToday', () => {
  const now = new Date('2026-09-05T14:30:00.000Z');

  it('counts only completed items created today', () => {
    const items = [
      item('2026-09-05T09:00:00.000Z', MEAL_ANALYSIS_STATUS.DONE),
      item('2026-09-05T23:59:59.999Z', MEAL_ANALYSIS_STATUS.PENDING),
      item('2026-09-04T23:59:59.000Z', MEAL_ANALYSIS_STATUS.DONE),
      item('2026-09-04T00:00:00.000Z', MEAL_ANALYSIS_STATUS.FAILED),
    ];

    expect(analysesCountToday(items, now)).toBe(1);
  });

  it('ignores pending and failed analyses', () => {
    const items = [
      item('2026-09-05T00:00:00.000Z', MEAL_ANALYSIS_STATUS.PENDING),
      item('2026-09-05T12:00:00.000Z', MEAL_ANALYSIS_STATUS.FAILED),
      item('2026-09-05T13:00:00.000Z', MEAL_ANALYSIS_STATUS.DONE),
    ];

    expect(analysesCountToday(items, now)).toBe(1);
  });

  it('returns 0 for empty history', () => {
    expect(analysesCountToday([], now)).toBe(0);
  });
});

describe('pendingMealCount', () => {
  it('counts pending meals', () => {
    const items = [
      item('2026-09-05T00:00:00.000Z', MEAL_ANALYSIS_STATUS.PENDING),
      item('2026-09-05T12:00:00.000Z', MEAL_ANALYSIS_STATUS.DONE),
    ];

    expect(pendingMealCount(items)).toBe(1);
  });
});