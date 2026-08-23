'use client';

import { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { MEAL_IMAGE_ANALYSIS_TEST_FIXTURE } from '@/lib/ai/constants';
import { SNAP_ANALYSIS_STATUS } from './constants';
import { snapAnalysisAtom, snapPhotoAtom } from './state';
import type { UseSnapAnalyzeResult, UseSnapPhotoResult } from './types';
import { snapPlaceholderAnalysisDelayMs } from './utils';

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

    await new Promise((resolve) => {
      window.setTimeout(resolve, snapPlaceholderAnalysisDelayMs());
    });

    setAnalysisState({
      STATUS: SNAP_ANALYSIS_STATUS.SUCCESS,
      ANALYSIS: MEAL_IMAGE_ANALYSIS_TEST_FIXTURE,
    });
  }, [photo, setAnalysisState]);

  return { analysisState, analyzePhoto, resetAnalysis };
}
