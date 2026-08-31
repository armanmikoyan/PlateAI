import { SNAP_SAVED_MEAL_CACHE_PREFIX } from '@/app/utils/meal-analyses/constants';
import type { SnapSavedMealCache } from '@/app/utils/meal-analyses/types';

function cacheKey(mealId: string): string {
  return `${SNAP_SAVED_MEAL_CACHE_PREFIX}${mealId}`;
}

function isSnapSavedMealCache(value: unknown): value is SnapSavedMealCache {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.status === 'string' &&
    typeof candidate.imageMimeType === 'string' &&
    typeof candidate.imageBase64 === 'string' &&
    (candidate.analysis === null || typeof candidate.analysis === 'object')
  );
}

export function writeSnapSavedMealCache(item: SnapSavedMealCache): void {
  try {
    sessionStorage.setItem(cacheKey(item.id), JSON.stringify(item));
  } catch {
    // Private browsing, quota exceeded, or disabled storage.
  }
}

export function readSnapSavedMealCache(mealId: string): SnapSavedMealCache | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(mealId));

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    return isSnapSavedMealCache(parsed) && parsed.id === mealId ? parsed : null;
  } catch {
    return null;
  }
}

export function clearSnapSavedMealCache(mealId: string): void {
  try {
    sessionStorage.removeItem(cacheKey(mealId));
  } catch {
    // Private browsing, quota exceeded, or disabled storage.
  }
}
