import { isActivePaidPlan, getDailyAnalysisLimit } from '@plate/plate-billing/utils';
import { MEAL_ANALYSIS_ERRORS } from '@/routes/meal-analyses/constants.js';
import type { MealAnalysisResult } from '@plate/plate-ai/types';
import type { MealAnalysisDocument } from '@/models/meal-analysis.js';
import type { SubscriptionEntitlementInput } from '@/routes/meal-analyses/types.js';
import type { SubscriptionPlan } from '@plate/plate-billing/types';
import type { MealAnalysisSummary } from '@plate/plate-ai/types';

export function canAnalyzeToday(analysisCount: number, plan: SubscriptionPlan | null): boolean {
  const limit = getDailyAnalysisLimit(plan);
  return analysisCount < limit;
}

export function formatDailyLimitReachedMessage(used: number, limit: number): string {
  return MEAL_ANALYSIS_ERRORS.DAILY_LIMIT_REACHED.replace('{used}', String(used)).replace(
    '{limit}',
    String(limit),
  );
}

export function hasSnapAnalysisAccess(subscription: SubscriptionEntitlementInput): boolean {
  return isActivePaidPlan(subscription.subscriptionPlan, subscription.subscriptionStatus);
}

export function isSnapAnalysisLocked(subscription: SubscriptionEntitlementInput): boolean {
  return !hasSnapAnalysisAccess(subscription);
}

export function toMealAnalysisResult(
  analysis: NonNullable<MealAnalysisDocument['analysis']>,
): MealAnalysisResult {
  return {
    mealName: analysis.mealName,
    calories: analysis.calories,
    proteinG: analysis.proteinG,
    carbsG: analysis.carbsG,
    fatG: analysis.fatG,
    confidence: analysis.confidence,
    notes: analysis.notes ?? null,
  };
}

export function toMealAnalysisSummary(document: MealAnalysisDocument): MealAnalysisSummary {
  return {
    id: document._id.toString(),
    status: document.status,
    imageMimeType: document.imageMimeType,
    imageBase64: document.imageBase64,
    analysis: document.analysis ? toMealAnalysisResult(document.analysis) : null,
    errorMessage: document.errorMessage ?? null,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export function isMealAnalysisResult(value: unknown): value is MealAnalysisResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.mealName === 'string' &&
    typeof candidate.calories === 'number' &&
    typeof candidate.proteinG === 'number' &&
    typeof candidate.carbsG === 'number' &&
    typeof candidate.fatG === 'number' &&
    typeof candidate.confidence === 'string' &&
    (typeof candidate.notes === 'string' || candidate.notes === null)
  );
}

export function parseCreateMealAnalysisBody(
  body: unknown,
): { imageBase64: string; imageMimeType: string } | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const candidate = body as Record<string, unknown>;
  const imageBase64 = candidate.imageBase64;
  const imageMimeType = candidate.imageMimeType;

  if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
    return null;
  }

  if (typeof imageMimeType !== 'string' || imageMimeType.length === 0) {
    return null;
  }

  return { imageBase64, imageMimeType };
}
