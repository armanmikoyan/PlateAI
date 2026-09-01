import { MEAL_ANALYSIS_STATUS, MEAL_ANALYSES_CHANGED_EVENT } from '@/app/utils/meal-analyses/constants';
import { SUBSCRIPTION_PLAN } from '@/app/api/auth/constants';
import type {
  MealAnalysisListResponse,
  MealAnalysisSummary,
  SnapSavedMealCache,
} from '@/app/utils/meal-analyses/types';

export function formatMealHistoryDate(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}

export function formatPlanDate(isoDate: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(new Date(isoDate));
}

export function isPaidPlan(plan: string | null): boolean {
  return plan === SUBSCRIPTION_PLAN.PLUS || plan === SUBSCRIPTION_PLAN.PRO;
}

export function pendingMealCount(items: readonly MealAnalysisSummary[]): number {
  return items.filter((item) => item.status === MEAL_ANALYSIS_STATUS.PENDING).length;
}

export function isPendingMealHistoryItem(item: MealAnalysisSummary): boolean {
  return item.status === MEAL_ANALYSIS_STATUS.PENDING;
}

export function mealHistoryRowHref(item: MealAnalysisSummary): string {
  return `/snap?meal=${encodeURIComponent(item.id)}`;
}

export function mealHistoryRowTitle(item: MealAnalysisSummary): string {
  if (item.analysis?.mealName) {
    return item.analysis.mealName;
  }

  return 'Saved meal photo';
}

export function mealHistoryImageSrc(item: MealAnalysisSummary): string {
  return `data:${item.imageMimeType};base64,${item.imageBase64}`;
}

export function mealHistorySnapCachePayload(item: MealAnalysisSummary): SnapSavedMealCache {
  return {
    id: item.id,
    status: item.status,
    imageMimeType: item.imageMimeType,
    imageBase64: item.imageBase64,
    analysis: item.analysis,
  };
}

export async function fetchMealHistory(): Promise<MealAnalysisListResponse | null> {
  try {
    const response = await fetch('/api/meal-analyses', { cache: 'no-store' });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as MealAnalysisListResponse;
  } catch {
    return null;
  }
}

export async function deletePendingMealAnalysis(mealId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/meal-analyses/${mealId}`, {
      method: 'DELETE',
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function notifyMealAnalysesChanged(): void {
  window.dispatchEvent(new Event(MEAL_ANALYSES_CHANGED_EVENT));
}
