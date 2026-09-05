'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AuthMeResponse } from '@/app/api/auth/types';
import type { MealAnalysisSummary } from '@plate/plate-ai/types';
import { MEAL_HISTORY } from './constants';
import type { UseMealHistoryResult } from './types';
import { fetchMealHistory, pendingMealCount } from './utils';

const PLAN_SYNC_MAX_ATTEMPTS = 10;
const PLAN_SYNC_RETRY_MS = 1000;

async function waitForRecordedPlan(): Promise<boolean> {
  for (let attempt = 0; attempt < PLAN_SYNC_MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });

      if (response.ok) {
        const payload = (await response.json()) as AuthMeResponse;

        if (payload.user.subscriptionPlan !== null && payload.user.subscriptionStatus !== null) {
          return true;
        }
      }
    } catch {
      // Retry.
    }

    if (attempt < PLAN_SYNC_MAX_ATTEMPTS - 1) {
      await new Promise((resolve) => setTimeout(resolve, PLAN_SYNC_RETRY_MS));
    }
  }

  return false;
}

export function useMealHistory(justPurchased = false): UseMealHistoryResult {
  const [items, setItems] = useState<readonly MealAnalysisSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (justPurchased) {
        const recorded = await waitForRecordedPlan();
        await fetch('/api/auth/refresh', { method: 'GET' });

        if (!recorded) {
          setError(MEAL_HISTORY.PLAN_SYNC_ERROR);
        }
      }

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

    loadMealHistory();

    return () => {
      cancelled = true;
    };
  }, [justPurchased]);

  return {
    items,
    pendingCount: pendingMealCount(items),
    loading,
    error,
    refresh,
  };
}
