import type { MealAnalysisDocument } from '@/models/meal-analysis.js';
import { SNAP_ANALYSIS_PLANS, SUBSCRIPTION_STATUS } from '@/routes/meal-analyses/constants.js';
import type { SubscriptionEntitlementInput } from '@/routes/meal-analyses/constants.js';
import type {
  MealAnalysisDetail,
  MealAnalysisResultDto,
  MealAnalysisSummary,
} from '@/routes/meal-analyses/types.js';

export function hasSnapAnalysisAccess(subscription: SubscriptionEntitlementInput): boolean {
  const { subscriptionPlan, subscriptionStatus } = subscription;

  if (subscriptionPlan === null || subscriptionStatus === null) {
    return false;
  }

  return (
    SNAP_ANALYSIS_PLANS.includes(subscriptionPlan) &&
    subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE
  );
}

export function isSnapAnalysisLocked(subscription: SubscriptionEntitlementInput): boolean {
  return !hasSnapAnalysisAccess(subscription);
}

export function toMealAnalysisResultDto(
  analysis: NonNullable<MealAnalysisDocument['analysis']>,
): MealAnalysisResultDto {
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
    analysis: document.analysis ? toMealAnalysisResultDto(document.analysis) : null,
    errorMessage: document.errorMessage ?? null,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export function toMealAnalysisDetail(document: MealAnalysisDocument): MealAnalysisDetail {
  return toMealAnalysisSummary(document);
}

export function isMealAnalysisResultDto(value: unknown): value is MealAnalysisResultDto {
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

export function parseCreateMealAnalysisBody(body: unknown): { imageBase64: string; imageMimeType: string } | null {
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
