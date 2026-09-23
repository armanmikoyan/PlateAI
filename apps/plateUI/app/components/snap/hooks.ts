'use client';

import { useCallback, useEffect, useState, type RefObject } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { MEAL_ANALYSIS_STATUS } from '@plate/plate-ai/constants';
import { isLockedMealAnalysis } from '@plate/plate-ai/utils';
import { readSnapSavedMealCache, writeSnapSavedMealCache } from '@/app/utils/meal-analyses/session-cache';
import { mealAnalysisImageUrl } from '@/app/utils/meal-analyses/image';
import { trackAnalysisComplete } from '@/app/utils/analytics';
import { RATE_LIMIT_TOAST_TIMEOUT_MS, RATE_LIMIT_TOAST_TITLE } from '@/app/utils/rate-limit/constants';
import { formatRetryDescription } from '@/app/utils/rate-limit/utils';
import { toast } from '@/app/ui/toast';
import { SNAP, SNAP_ANALYSIS_STATUS, SNAP_LOCKED_REASON, SNAP_ORB } from './constants';
import { snapAnalysisAtom, snapPhotoAtom, snapResumeAnalysisIdAtom } from './state';
import type {
  SavedMealPayload,
  SnapAnalyzeErrorResponse,
  SnapAnalyzeSuccessResponse,
  UseSnapAnalyzeResult,
  UseSnapPhotoResult,
  UseSnapSavedMealLoaderResult,
} from './types';
import { compressImageFile, toSnapSavedMealCache } from './utils';

export function useSnapOrbSize(containerRef: RefObject<HTMLDivElement | null>): number {
  const [size, setSize] = useState(0);

  useEffect(() => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const computeSize = () => {
      const fit = Math.min(element.clientWidth, element.clientHeight) * SNAP_ORB.FILL;
      setSize(Math.max(0, Math.min(SNAP_ORB.MAX_SIZE, fit)));
    };

    computeSize();

    const observer = new ResizeObserver(computeSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, [containerRef]);

  return size;
}

export function useSnapPhoto(): UseSnapPhotoResult {
  const photo = useAtomValue(snapPhotoAtom);
  const setSnapPhoto = useSetAtom(snapPhotoAtom);
  const setAnalysis = useSetAtom(snapAnalysisAtom);
  const setResumeAnalysisId = useSetAtom(snapResumeAnalysisIdAtom);

  const setPhoto = useCallback(
    (file: File | null) => {
      setAnalysis({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
      setResumeAnalysisId(null);
      setSnapPhoto((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.PREVIEW_URL);
        }

        if (!file) {
          return null;
        }

        return {
          FILE: file,
          PREVIEW_URL: URL.createObjectURL(file),
        };
      });
    },
    [setAnalysis, setResumeAnalysisId, setSnapPhoto],
  );

  return { photo, setPhoto };
}

function useSnapSessionReset() {
  const setSnapPhoto = useSetAtom(snapPhotoAtom);
  const setAnalysis = useSetAtom(snapAnalysisAtom);
  const setResumeAnalysisId = useSetAtom(snapResumeAnalysisIdAtom);

  return useCallback(() => {
    setSnapPhoto((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.PREVIEW_URL);
      }

      return null;
    });
    setAnalysis({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
    setResumeAnalysisId(null);
  }, [setAnalysis, setResumeAnalysisId, setSnapPhoto]);
}

export function useSnapSavedMealLoader(): UseSnapSavedMealLoaderResult {
  const searchParams = useSearchParams();
  const setAnalysis = useSetAtom(snapAnalysisAtom);
  const setSnapPhoto = useSetAtom(snapPhotoAtom);
  const setResumeAnalysisId = useSetAtom(snapResumeAnalysisIdAtom);
  const resetSnapSession = useSnapSessionReset();
  const mealId = searchParams.get('meal');
  const [loadingSavedMeal, setLoadingSavedMeal] = useState(() => Boolean(mealId));

  const applySavedMeal = useCallback(
    (item: SavedMealPayload) => {
      setSnapPhoto((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.PREVIEW_URL);
        }

        return {
          FILE: null,
          PREVIEW_URL: mealAnalysisImageUrl(item.id),
        };
      });

      if (item.status === MEAL_ANALYSIS_STATUS.DONE && item.analysis) {
        setResumeAnalysisId(null);

        if (isLockedMealAnalysis(item.analysis)) {
          setAnalysis({
            STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
            LOCKED: true,
            LOCKED_REASON: SNAP_LOCKED_REASON.PLAN,
            ANALYSIS_ID: item.id,
            ANALYSIS: item.analysis,
          });
          return;
        }

        setAnalysis({
          STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
          LOCKED: false,
          ANALYSIS: item.analysis,
          ANALYSIS_ID: item.id,
        });
        return;
      }

      setResumeAnalysisId(item.id);
      setAnalysis({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
    },
    [setAnalysis, setResumeAnalysisId, setSnapPhoto],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadSavedMeal() {
      await Promise.resolve();

      if (cancelled) {
        return;
      }

      if (!mealId) {
        resetSnapSession();
        setLoadingSavedMeal(false);
        return;
      }

      const cachedMeal = readSnapSavedMealCache(mealId);

      if (cachedMeal) {
        applySavedMeal(cachedMeal);
        setLoadingSavedMeal(false);
      } else {
        setLoadingSavedMeal(true);
      }

      try {
        const response = await fetch(`/api/meal-analyses/${mealId}`, { cache: 'no-store' });

        if (!response.ok || cancelled) {
          return;
        }

        const payload = (await response.json()) as { item: SavedMealPayload };

        writeSnapSavedMealCache(toSnapSavedMealCache(payload.item));

        if (!cancelled) {
          applySavedMeal(payload.item);
        }
      } catch {
        // Ignore — cached photo or manual upload still works.
      } finally {
        if (!cancelled) {
          setLoadingSavedMeal(false);
        }
      }
    }

    loadSavedMeal();

    return () => {
      cancelled = true;
    };
  }, [applySavedMeal, mealId, resetSnapSession]);

  return { loadingSavedMeal };
}

export function useSnapAnalyze(): UseSnapAnalyzeResult {
  const photo = useAtomValue(snapPhotoAtom);
  const resumeAnalysisId = useAtomValue(snapResumeAnalysisIdAtom);
  const [analysisState, setAnalysisState] = useAtom(snapAnalysisAtom);
  const setResumeAnalysisId = useSetAtom(snapResumeAnalysisIdAtom);

  const resetAnalysis = useCallback(() => {
    setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
    setResumeAnalysisId(null);
  }, [setAnalysisState, setResumeAnalysisId]);

  const showDailyLimitLockedAnalysis = useCallback(
    (analysisId: string) => {
      setAnalysisState({
        STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
        LOCKED: true,
        LOCKED_REASON: SNAP_LOCKED_REASON.DAILY_LIMIT,
        ANALYSIS_ID: analysisId,
      });
    },
    [setAnalysisState],
  );

  const applyPendingAnalysis = useCallback(
    (body: SnapAnalyzeSuccessResponse) => {
      setResumeAnalysisId(null);

      if (isLockedMealAnalysis(body.analysis)) {
        setAnalysisState({
          STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
          LOCKED: true,
          LOCKED_REASON: SNAP_LOCKED_REASON.PLAN,
          ANALYSIS_ID: body.id,
          ANALYSIS: body.analysis,
        });
        return;
      }

      trackAnalysisComplete(body.analysis.confidence);
      setAnalysisState({
        STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
        LOCKED: false,
        ANALYSIS: body.analysis,
        ANALYSIS_ID: body.id,
      });
    },
    [setAnalysisState, setResumeAnalysisId],
  );

  const completePendingAnalysis = useCallback(
    async (analysisId: string) => {
      setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.LOADING });

      try {
        const response = await fetch(`/api/meal-analyses/${analysisId}/complete`, {
          method: 'POST',
        });

        if (response.status === 401) {
          setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.SIGN_IN_REQUIRED });
          return;
        }

        if (response.status === 429) {
          const body = (await response.json().catch(() => null)) as SnapAnalyzeErrorResponse | null;

          if (body?.retryAfterSeconds) {
            toast.add({
              title: RATE_LIMIT_TOAST_TITLE,
              description: formatRetryDescription(body.retryAfterSeconds),
              type: 'warning',
              timeout: RATE_LIMIT_TOAST_TIMEOUT_MS,
            });
            setResumeAnalysisId(analysisId);
            setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
            return;
          }

          const message = body?.error ?? SNAP.DAILY_LIMIT_REACHED;
          toast.add({
            title: SNAP.DAILY_LIMIT_TITLE,
            description: message,
            type: 'error',
            timeout: SNAP.DAILY_LIMIT_TOAST_TIMEOUT_MS,
          });
          showDailyLimitLockedAnalysis(analysisId);
          return;
        }

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as SnapAnalyzeErrorResponse | null;
          setResumeAnalysisId(body?.id ?? analysisId);
          setAnalysisState({
            STATUS: SNAP_ANALYSIS_STATUS.ERROR,
            MESSAGE: body?.error ?? SNAP.ANALYSIS_ERROR,
          });
          return;
        }

        const body = (await response.json()) as SnapAnalyzeSuccessResponse;
        applyPendingAnalysis(body);
      } catch {
        setResumeAnalysisId(analysisId);
        setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.ANALYSIS_ERROR });
      }
    },
    [applyPendingAnalysis, setAnalysisState, setResumeAnalysisId, showDailyLimitLockedAnalysis],
  );

  const analyzePhoto = useCallback(async () => {
    if (!photo) {
      return;
    }

    if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS && analysisState.LOCKED === true) {
      await completePendingAnalysis(analysisState.ANALYSIS_ID);
      return;
    }

    if (resumeAnalysisId) {
      await completePendingAnalysis(resumeAnalysisId);
      return;
    }

    setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.LOADING });

    if (!photo.FILE) {
      setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.ANALYSIS_ERROR });
      return;
    }

    try {
      const uploadFile = await compressImageFile(photo.FILE);
      const formData = new FormData();
      formData.append('image', uploadFile);

      const response = await fetch('/api/snap/analyze', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 401) {
        setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.SIGN_IN_REQUIRED });
        return;
      }

      if (response.status === 429) {
        const body = (await response.json().catch(() => null)) as SnapAnalyzeErrorResponse | null;

        if (body?.planRequired) {
          toast.add({
            title: SNAP.FREE_LIMIT_TITLE,
            description: body.error ?? SNAP.FREE_LIMIT_REACHED,
            type: 'error',
            timeout: SNAP.DAILY_LIMIT_TOAST_TIMEOUT_MS,
          });
          setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.PLAN_REQUIRED });
          return;
        }

        if (body?.pendingLimit) {
          toast.add({
            title: SNAP.PENDING_LIMIT_TITLE,
            description: body.error ?? SNAP.PENDING_LIMIT_REACHED,
            type: 'error',
            timeout: SNAP.DAILY_LIMIT_TOAST_TIMEOUT_MS,
          });
          setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
          return;
        }

        if (body?.retryAfterSeconds) {
          toast.add({
            title: RATE_LIMIT_TOAST_TITLE,
            description: formatRetryDescription(body.retryAfterSeconds),
            type: 'warning',
            timeout: RATE_LIMIT_TOAST_TIMEOUT_MS,
          });
          setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
          return;
        }

        const message = body?.error ?? SNAP.DAILY_LIMIT_REACHED;
        toast.add({
          title: SNAP.DAILY_LIMIT_TITLE,
          description: message,
          type: 'error',
          timeout: SNAP.DAILY_LIMIT_TOAST_TIMEOUT_MS,
        });
        if (body?.id) {
          showDailyLimitLockedAnalysis(body.id);
        } else {
          setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
        }
        return;
      }

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as SnapAnalyzeErrorResponse | null;
        if (body?.id) {
          setResumeAnalysisId(body.id);
        }
        setAnalysisState({
          STATUS: SNAP_ANALYSIS_STATUS.ERROR,
          MESSAGE: body?.error ?? SNAP.ANALYSIS_ERROR,
        });
        return;
      }

      const body = (await response.json()) as SnapAnalyzeSuccessResponse;
      applyPendingAnalysis(body);
    } catch {
      setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.ANALYSIS_ERROR });
    }
  }, [
    analysisState,
    applyPendingAnalysis,
    completePendingAnalysis,
    photo,
    resumeAnalysisId,
    setAnalysisState,
    setResumeAnalysisId,
    showDailyLimitLockedAnalysis,
  ]);

  return { analysisState, analyzePhoto, completePendingAnalysis, resetAnalysis };
}
