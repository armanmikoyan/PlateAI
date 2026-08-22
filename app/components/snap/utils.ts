import type { ImageLoaderProps } from 'next/image';
import type { MealAnalysisConfidence, MealImageAnalysis } from '@/lib/ai/types';
import type { DeviceType } from '@/lib/device-detection/types';
import { DEVICE_TYPE } from '@/lib/device-detection/types';
import {
  HERO_CALORIES_TILE,
  HERO_NUTRIENT_METRIC_ROWS,
  type HeroNutrientMetricRow,
  type HeroNutrientTileRowModel,
  type HeroStatTileModel,
} from '@/app/components/hero/constants';
import { SNAP, SNAP_ANALYSIS_STATUS, SNAP_CONFIDENCE_LABELS, SNAP_HEADING_PHASE } from './constants';
import type { SnapAnalysisState, SnapHeadingCopy, SnapHeadingPhase, SnapPhoto } from './types';

const SNAP_MACRO_ROW_KEYS = new Set<HeroNutrientMetricRow['KEY']>(['PROTEIN', 'CARBS', 'FAT']);

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

  if (phase === SNAP_HEADING_PHASE.ERROR) {
    return {
      PHASE: phase,
      TITLE: SNAP.HEADING_NOT_DETECTED_TITLE,
      SUBTITLE: SNAP.HEADING_NOT_DETECTED_SUBTITLE,
    };
  }

  if (analysisState.STATUS !== SNAP_ANALYSIS_STATUS.SUCCESS) {
    return {
      PHASE: SNAP_HEADING_PHASE.IDLE,
      TITLE: SNAP.TITLE,
      SUBTITLE: deviceType === DEVICE_TYPE.PHONE ? SNAP.SUBTITLE_PHONE : SNAP.SUBTITLE,
    };
  }

  return {
    PHASE: phase,
    TITLE: `${analysisState.ANALYSIS.mealName} detected`,
    SUBTITLE: SNAP.HEADING_DETECTED_SUBTITLE,
  };
}

export function snapCaloriesTileForAnalysis(analysis: MealImageAnalysis): HeroStatTileModel {
  return {
    ...HERO_CALORIES_TILE,
    VALUE: String(analysis.calories),
  };
}

export function snapMacroTilesForAnalysis(
  analysis: MealImageAnalysis,
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

export function blobImageLoader({ src }: ImageLoaderProps): string {
  return src;
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
