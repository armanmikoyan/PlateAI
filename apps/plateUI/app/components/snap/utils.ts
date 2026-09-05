import type { MealAnalysisConfidence, MealAnalysisResult } from '@plate/plate-ai/types';
import type { DeviceType } from '@/app/utils/device-detection/types';
import { DEVICE_TYPE } from '@/app/utils/device-detection/types';
import type { SnapSavedMealCache } from '@/app/utils/meal-analyses/types';
import {
  HERO_CALORIES_TILE,
  HERO_NUTRIENT_METRIC_ROWS,
  type HeroNutrientMetricRow,
  type HeroNutrientTileRowModel,
  type HeroStatTileChrome,
  type HeroStatTileModel,
} from '@/app/components/hero/constants';
import {
  SNAP,
  SNAP_ANALYSIS_STATUS,
  SNAP_CONFIDENCE_LABELS,
  SNAP_HEADING_PHASE,
  SNAP_LOCKED_PREVIEW_DELAY_MS_PRESET,
  SNAP_LOCKED_REASON,
} from './constants';
import type { SavedMealPayload, SnapAnalysisState, SnapHeadingCopy, SnapHeadingPhase, SnapPhoto } from './types';

const SNAP_MACRO_ROW_KEYS = new Set<HeroNutrientMetricRow['KEY']>(['PROTEIN', 'CARBS', 'FAT']);

export function toSnapSavedMealCache(item: SavedMealPayload): SnapSavedMealCache {
  return {
    id: item.id,
    status: item.status,
    imageMimeType: item.imageMimeType,
    imageBase64: item.imageBase64,
    analysis: item.analysis,
  };
}

export function snapHeadingPhase(
  photo: SnapPhoto | null,
  analysisState: SnapAnalysisState,
): SnapHeadingPhase {
  if (!photo) {
    return SNAP_HEADING_PHASE.IDLE;
  }

  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.LOADING) {
    return SNAP_HEADING_PHASE.LOADING;
  }

  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS) {
    return SNAP_HEADING_PHASE.SUCCESS;
  }

  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.ERROR) {
    return SNAP_HEADING_PHASE.ERROR;
  }

  return SNAP_HEADING_PHASE.PHOTO_READY;
}

export function snapHeadingCopy(
  photo: SnapPhoto | null,
  analysisState: SnapAnalysisState,
  deviceType: DeviceType,
): SnapHeadingCopy {
  const phase = snapHeadingPhase(photo, analysisState);

  if (phase === SNAP_HEADING_PHASE.IDLE) {
    return {
      PHASE: phase,
      TITLE: SNAP.TITLE,
      SUBTITLE: deviceType === DEVICE_TYPE.PHONE ? SNAP.SUBTITLE_PHONE : SNAP.SUBTITLE,
    };
  }

  if (phase === SNAP_HEADING_PHASE.PHOTO_READY) {
    return {
      PHASE: phase,
      TITLE: SNAP.HEADING_PHOTO_READY_TITLE,
      SUBTITLE: SNAP.HEADING_PHOTO_READY_SUBTITLE,
    };
  }

  if (phase === SNAP_HEADING_PHASE.LOADING) {
    return {
      PHASE: phase,
      TITLE: SNAP.HEADING_LOADING_TITLE,
      SUBTITLE: SNAP.HEADING_LOADING_SUBTITLE,
    };
  }

  if (phase === SNAP_HEADING_PHASE.SUCCESS) {
    if (
      analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS &&
      analysisState.LOCKED === false
    ) {
      return {
        PHASE: phase,
        TITLE: analysisState.ANALYSIS.mealName,
        SUBTITLE: SNAP.ANALYSIS_SCOPE,
      };
    }

    if (
      analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS &&
      analysisState.LOCKED === true &&
      analysisState.LOCKED_REASON === SNAP_LOCKED_REASON.DAILY_LIMIT
    ) {
      return {
        PHASE: phase,
        TITLE: SNAP.HEADING_DAILY_LIMIT_TITLE,
        SUBTITLE: SNAP.HEADING_DAILY_LIMIT_SUBTITLE,
      };
    }

    return {
      PHASE: phase,
      TITLE: SNAP.HEADING_LOCKED_TITLE,
      SUBTITLE: SNAP.HEADING_LOCKED_SUBTITLE,
    };
  }

  if (phase === SNAP_HEADING_PHASE.ERROR) {
    return {
      PHASE: phase,
      TITLE: SNAP.HEADING_ERROR_TITLE,
      SUBTITLE: SNAP.HEADING_ERROR_SUBTITLE,
    };
  }

  return {
    PHASE: SNAP_HEADING_PHASE.IDLE,
    TITLE: SNAP.TITLE,
    SUBTITLE: deviceType === DEVICE_TYPE.PHONE ? SNAP.SUBTITLE_PHONE : SNAP.SUBTITLE,
  };
}

export function snapCaloriesTileForAnalysis(analysis: MealAnalysisResult): HeroStatTileModel {
  return {
    ...HERO_CALORIES_TILE,
    VALUE: String(analysis.calories),
  };
}

export function snapMacroTilesForAnalysis(
  analysis: MealAnalysisResult,
): readonly HeroNutrientTileRowModel[] {
  const values = {
    PROTEIN: String(analysis.proteinG),
    CARBS: String(analysis.carbsG),
    FAT: String(analysis.fatG),
  } as const;

  return HERO_NUTRIENT_METRIC_ROWS.filter((row) => SNAP_MACRO_ROW_KEYS.has(row.KEY)).map((row) => {
    if (row.KEY !== 'PROTEIN' && row.KEY !== 'CARBS' && row.KEY !== 'FAT') {
      throw new Error(`Unexpected macro key: ${row.KEY}`);
    }

    return {
      ...row,
      VALUE: values[row.KEY],
    };
  });
}

export function firstAcceptedImageFile(files: FileList | null): File | null {
  return files?.item(0) ?? null;
}

export function canUseCameraStream(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.isSecureContext && Boolean(navigator.mediaDevices?.getUserMedia);
}

export async function fileFromJpegDataUrl(dataUrl: string, fileName: string): Promise<File> {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: 'image/jpeg' });
}

const SNAP_CONFIDENCE_LABEL_BY_VALUE: Record<MealAnalysisConfidence, string> = {
  low: SNAP_CONFIDENCE_LABELS.LOW,
  medium: SNAP_CONFIDENCE_LABELS.MEDIUM,
  high: SNAP_CONFIDENCE_LABELS.HIGH,
};

export function snapConfidenceLabel(confidence: MealAnalysisConfidence): string {
  return SNAP_CONFIDENCE_LABEL_BY_VALUE[confidence];
}

export function snapLockedCaloriesTile(): HeroStatTileChrome {
  return HERO_CALORIES_TILE;
}

export function snapLockedNutrientTiles(): readonly HeroNutrientMetricRow[] {
  return HERO_NUTRIENT_METRIC_ROWS;
}

export function snapLockedPreviewDelayMs(): number {
  const { MIN, MAX } = SNAP_LOCKED_PREVIEW_DELAY_MS_PRESET;
  return MIN + Math.floor(Math.random() * (MAX - MIN + 1));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function waitForSnapLockedPreviewDelay(startedAtMs: number): Promise<void> {
  const elapsedMs = Date.now() - startedAtMs;
  const remainingMs = snapLockedPreviewDelayMs() - elapsedMs;

  if (remainingMs > 0) {
    await sleep(remainingMs);
  }
}

export function fileFromImageBase64(imageBase64: string, mimeType: string, fileName = 'saved-meal'): File {
  const bytes = Uint8Array.from(atob(imageBase64), (char) => char.charCodeAt(0));
  const extension = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg';

  return new File([bytes], `${fileName}.${extension}`, { type: mimeType });
}
