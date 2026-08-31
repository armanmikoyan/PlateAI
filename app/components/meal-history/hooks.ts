'use client';

import { useCallback, useEffect, useState } from 'react';

import { clearSnapSavedMealCache } from '@/app/utils/meal-analyses/session-cache';
import type { MealAnalysisSummary } from '@/app/utils/meal-analyses/types';

import { MEAL_HISTORY } from './constants';
import type { UseMealHistoryResult } from './types';
import {
  deletePendingMealAnalysis,
  fetchMealHistory,
  notifyMealAnalysesChanged,
  pendingMealCount,
} from './utils';

export function useMealHistory(): UseMealHistoryResult {
  const [items, setItems] = useState<readonly MealAnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingMealId, setRemovingMealId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const payload = await fetchMealHistory();

    if (!payload) {
      setItems([]);
      setError(MEAL_HISTORY.LOAD_ERROR);
      setLoading(false);
      return;
    }

    setItems(payload.items);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMealHistory() {
      const payload = await fetchMealHistory();

      if (cancelled) {
        return;
      }

      if (!payload) {
        setItems([]);
        setError(MEAL_HISTORY.LOAD_ERROR);
      } else {
        setItems(payload.items);
        setError(null);
      }

      setLoading(false);
    }

    void loadMealHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  const removeMeal = useCallback(async (mealId: string) => {
    setRemovingMealId(mealId);
    setError(null);

    const deleted = await deletePendingMealAnalysis(mealId);

    if (!deleted) {
      setError(MEAL_HISTORY.REMOVE_ERROR);
      setRemovingMealId(null);
      return;
    }

    clearSnapSavedMealCache(mealId);
    setItems((current) => current.filter((item) => item.id !== mealId));
    notifyMealAnalysesChanged();
    setRemovingMealId(null);
  }, []);

  return {
    items,
    pendingCount: pendingMealCount(items),
    loading,
    error,
    removingMealId,
    removeMeal,
    refresh,
  };
}
