'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useSearchParams } from 'next/navigation';
import { MEAL_ANALYSIS_STATUS } from '@/app/utils/meal-analyses/constants';
import { readSnapSavedMealCache, writeSnapSavedMealCache } from '@/app/utils/meal-analyses/session-cache';
import type { SnapSavedMealCache } from '@/app/utils/meal-analyses/types';
import { SNAP, SNAP_ANALYSIS_STATUS } from './constants';
import { snapAnalysisAtom, snapPhotoAtom, snapResumeAnalysisIdAtom } from './state';
import type {
  SnapAnalyzeErrorResponse,
  SnapAnalyzeLockedResponse,
  SnapAnalyzeSuccessResponse,
  UseSnapAnalyzeResult,
  UseSnapPhotoResult,
  UseSnapSavedMealLoaderResult,
} from './types';
import { fileFromImageBase64, waitForSnapLockedPreviewDelay } from './utils';

type SavedMealPayload = Readonly<{
  id: string;
  status: string;
  imageMimeType: string;
  imageBase64: string;
  analysis: SnapAnalyzeSuccessResponse['analysis'] | null;
}>;

function toSnapSavedMealCache(item: SavedMealPayload): SnapSavedMealCache {
  return {
    id: item.id,
    status: item.status as SnapSavedMealCache['status'],
    imageMimeType: item.imageMimeType,
    imageBase64: item.imageBase64,
    analysis: item.analysis,
  };
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
      const file = fileFromImageBase64(
        item.imageBase64,
        item.imageMimeType,
        `meal-${item.id}`,
      );

      setSnapPhoto((previous) => {
        if (previous) {
          URL.revokeObjectURL(previous.PREVIEW_URL);
        }

        return {
          FILE: file,
          PREVIEW_URL: URL.createObjectURL(file),
        };
      });

      if (item.status === MEAL_ANALYSIS_STATUS.DONE && item.analysis) {
        setResumeAnalysisId(null);
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

  const showLockedAnalysis = useCallback(
    async (analysisId: string, startedAtMs: number) => {
      await waitForSnapLockedPreviewDelay(startedAtMs);
      setAnalysisState({
        STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
        LOCKED: true,
        ANALYSIS_ID: analysisId,
      });
    },
    [setAnalysisState],
  );

  const completePendingAnalysis = useCallback(
    async (analysisId: string) => {
      setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.LOADING });
      const startedAtMs = Date.now();

      try {
        const response = await fetch(`/api/meal-analyses/${analysisId}/complete`, {
          method: 'POST',
        });

        if (response.status === 401) {
          setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.SIGN_IN_REQUIRED });
          return;
        }

        if (response.status === 403) {
          await showLockedAnalysis(analysisId, startedAtMs);
          return;
        }

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as SnapAnalyzeErrorResponse | null;
          setAnalysisState({
            STATUS: SNAP_ANALYSIS_STATUS.ERROR,
            MESSAGE: body?.error ?? SNAP.ANALYSIS_ERROR,
          });
          return;
        }

        const body = (await response.json()) as SnapAnalyzeSuccessResponse;
        setResumeAnalysisId(null);
        setAnalysisState({
          STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
          LOCKED: false,
          ANALYSIS: body.analysis,
          ANALYSIS_ID: body.id,
        });
      } catch {
        setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.ANALYSIS_ERROR });
      }
    },
    [setAnalysisState, setResumeAnalysisId, showLockedAnalysis],
  );

  const analyzePhoto = useCallback(async () => {
    if (!photo) {
      return;
    }

    if (
      analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS &&
      analysisState.LOCKED === true
    ) {
      await completePendingAnalysis(analysisState.ANALYSIS_ID);
      return;
    }

    if (resumeAnalysisId) {
      await completePendingAnalysis(resumeAnalysisId);
      return;
    }

    setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.LOADING });

    const startedAtMs = Date.now();

    try {
      const formData = new FormData();
      formData.append('image', photo.FILE);

      const response = await fetch('/api/snap/analyze', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 401) {
        setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.SIGN_IN_REQUIRED });
        return;
      }

      if (response.status === 403) {
        const body = (await response.json()) as SnapAnalyzeLockedResponse;
        await showLockedAnalysis(body.id, startedAtMs);
        return;
      }

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as SnapAnalyzeErrorResponse | null;
        setAnalysisState({
          STATUS: SNAP_ANALYSIS_STATUS.ERROR,
          MESSAGE: body?.error ?? SNAP.ANALYSIS_ERROR,
        });
        return;
      }

      const body = (await response.json()) as SnapAnalyzeSuccessResponse;
      setResumeAnalysisId(null);
      setAnalysisState({
        STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
        LOCKED: false,
        ANALYSIS: body.analysis,
        ANALYSIS_ID: body.id,
      });
    } catch {
      setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.ANALYSIS_ERROR });
    }
  }, [analysisState, completePendingAnalysis, photo, resumeAnalysisId, setAnalysisState, setResumeAnalysisId, showLockedAnalysis]);

  return { analysisState, analyzePhoto, completePendingAnalysis, resetAnalysis };
}
