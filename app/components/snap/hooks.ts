'use client';

import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { SNAP, SNAP_ANALYSIS_STATUS } from './constants';
import { snapAnalysisAtom, snapPhotoAtom } from './state';
import type { SnapAnalyzeErrorResponse, SnapAnalyzeSuccessResponse, UseSnapAnalyzeResult, UseSnapPhotoResult } from './types';
import { waitForSnapLockedPreviewDelay } from './utils';

export function useSnapPhoto(): UseSnapPhotoResult {
  const photo = useAtomValue(snapPhotoAtom);
  const setSnapPhoto = useSetAtom(snapPhotoAtom);
  const setAnalysis = useSetAtom(snapAnalysisAtom);

  const setPhoto = useCallback(
    (file: File | null) => {
      setAnalysis({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
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
    [setAnalysis, setSnapPhoto],
  );

  return { photo, setPhoto };
}

export function useSnapAnalyze(): UseSnapAnalyzeResult {
  const photo = useAtomValue(snapPhotoAtom);
  const [analysisState, setAnalysisState] = useAtom(snapAnalysisAtom);

  const resetAnalysis = useCallback(() => {
    setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.IDLE });
  }, [setAnalysisState]);

  const analyzePhoto = useCallback(async () => {
    if (!photo) {
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
        await waitForSnapLockedPreviewDelay(startedAtMs);
        setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.SUCCESS, LOCKED: true });
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
      setAnalysisState({
        STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
        LOCKED: false,
        ANALYSIS: body.analysis,
      });
    } catch {
      setAnalysisState({ STATUS: SNAP_ANALYSIS_STATUS.ERROR, MESSAGE: SNAP.ANALYSIS_ERROR });
    }
  }, [photo, setAnalysisState]);

  return { analysisState, analyzePhoto, resetAnalysis };
}
