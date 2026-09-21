import type { MealAnalysisConfidence, MealAnalysisResult } from '@plate/plate-ai/types';
import type { DeviceType } from '@/app/utils/device-detection/types';
import { DEVICE_TYPE } from '@/app/utils/device-detection/types';
import type { SnapSavedMealCache } from '@/app/utils/meal-analyses/types';
import {
  HERO_CALORIES_TILE,
  HERO_NUTRIENT_METRIC_ROWS,
  HERO_PROTEIN_TILE,
  type HeroNutrientMetricRow,
  type HeroNutrientTileRowModel,
  type HeroStatTileChrome,
  type HeroStatTileModel,
} from '@/app/components/hero/constants';
import {
  ACCEPTED_IMAGE_TYPES,
  SNAP,
  SNAP_ANALYSIS_STATUS,
  SNAP_CONFIDENCE_LABELS,
  SNAP_HEADING_PHASE,
  SNAP_IMAGE_COMPRESSION,
  SNAP_LOCKED_REASON,
} from './constants';
import type {
  SavedMealPayload,
  SnapAnalysisState,
  SnapHeadingCopy,
  SnapHeadingPhase,
  SnapNutrientValues,
  SnapPhoto,
} from './types';

const SNAP_RESULT_ROW_KEYS = new Set<HeroNutrientMetricRow['KEY']>([
  'CARBS',
  'FAT',
  'SAT_FAT',
  'FIBER',
  'SUGAR',
  'SODIUM',
  'POTASSIUM',
]);

export function toSnapSavedMealCache(item: SavedMealPayload): SnapSavedMealCache {
  return {
    id: item.id,
    status: item.status,
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
    if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.PLAN_REQUIRED) {
      return {
        PHASE: phase,
        TITLE: SNAP.HEADING_FREE_LIMIT_TITLE,
        SUBTITLE: SNAP.HEADING_FREE_LIMIT_SUBTITLE,
      };
    }

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
    if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS && analysisState.LOCKED === false) {
      return {
        PHASE: phase,
        TITLE: analysisState.ANALYSIS.mealName,
        SUBTITLE: SNAP.ANALYSIS_SCOPE,
      };
    }

    if (
      analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS &&
      analysisState.LOCKED === true &&
      analysisState.LOCKED_REASON === SNAP_LOCKED_REASON.PLAN
    ) {
      return {
        PHASE: phase,
        TITLE: analysisState.ANALYSIS.mealName,
        SUBTITLE: SNAP.HEADING_LOCKED_SUBTITLE,
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
      TITLE: SNAP.TITLE,
      SUBTITLE: SNAP.ANALYSIS_SCOPE,
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

function snapNutrientValueForAnalysis(
  key: HeroNutrientMetricRow['KEY'],
  analysis: SnapNutrientValues,
): string {
  switch (key) {
    case 'CARBS':
      return String(analysis.carbsG);
    case 'FAT':
      return String(analysis.fatG);
    case 'SAT_FAT':
      return String(analysis.satFatG);
    case 'FIBER':
      return String(analysis.fiberG);
    case 'SUGAR':
      return String(analysis.sugarG);
    case 'SODIUM':
      return String(analysis.sodiumMg);
    case 'POTASSIUM':
      return String(analysis.potassiumMg);
    default:
      throw new Error(`Unexpected nutrient tile key: ${key}`);
  }
}

export function snapNutrientTilesForAnalysis(
  analysis: SnapNutrientValues,
): readonly HeroNutrientTileRowModel[] {
  return HERO_NUTRIENT_METRIC_ROWS.filter((row) => SNAP_RESULT_ROW_KEYS.has(row.KEY)).map((row) => {
    return {
      ...row,
      VALUE: snapNutrientValueForAnalysis(row.KEY, analysis),
    };
  });
}

export function snapLockedNutrientTiles(): readonly HeroNutrientMetricRow[] {
  return HERO_NUTRIENT_METRIC_ROWS.filter((row) => SNAP_RESULT_ROW_KEYS.has(row.KEY));
}

export function snapCaloriesTileForAnalysis(analysis: MealAnalysisResult): HeroStatTileModel {
  return {
    ...HERO_CALORIES_TILE,
    VALUE: String(analysis.calories),
  };
}

export function snapProteinTileForAnalysis(analysis: MealAnalysisResult): HeroStatTileModel {
  return {
    ...HERO_PROTEIN_TILE,
    VALUE: String(analysis.proteinG),
  };
}

export function snapLockedCaloriesTile(): HeroStatTileChrome {
  return HERO_CALORIES_TILE;
}

export function snapLockedProteinTile(): HeroStatTileChrome {
  return HERO_PROTEIN_TILE;
}

export function firstAcceptedImageFile(files: FileList | null): File | null {
  return files?.item(0) ?? null;
}

export function shouldCompressImageFile(file: File): boolean {
  return (
    ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number]) &&
    file.size > SNAP_IMAGE_COMPRESSION.MIN_SOURCE_BYTES
  );
}

export async function compressImageFile(file: File): Promise<File> {
  if (!shouldCompressImageFile(file)) {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const { MAX_DIMENSION_PX, JPEG_QUALITY, OUTPUT_MIME_TYPE } = SNAP_IMAGE_COMPRESSION;

    const scale = Math.min(1, MAX_DIMENSION_PX / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      bitmap.close();
      return file;
    }

    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, OUTPUT_MIME_TYPE, JPEG_QUALITY);
    });

    if (!blob || blob.size >= file.size) {
      return file;
    }

    const outputName = file.name.replace(/\.\w+$/, '.jpg');
    return new File([blob], outputName, { type: OUTPUT_MIME_TYPE });
  } catch {
    return file;
  }
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
