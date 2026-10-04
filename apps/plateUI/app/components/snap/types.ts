import type { DragEvent, MouseEvent, ReactNode } from 'react';
import type {
  MealAnalysisLockedResult,
  MealAnalysisPreview,
  MealAnalysisResult,
  MealAnalysisStatus,
} from '@plate/plate-ai/types';
import type { HeroStatTileChrome } from '@/app/components/hero/constants';
import { SNAP_ANALYSIS_STATUS, SNAP_HEADING_PHASE, SNAP_LOCKED_REASON, SNAP_PANEL_STAGE } from './constants';

export type AcceptedImageType = 'image/jpeg' | 'image/png' | 'image/webp';

export type SnapAnalysisStatus = (typeof SNAP_ANALYSIS_STATUS)[keyof typeof SNAP_ANALYSIS_STATUS];

export type SnapHeadingPhase = (typeof SNAP_HEADING_PHASE)[keyof typeof SNAP_HEADING_PHASE];

export type SavedMealPayload = Readonly<{
  id: string;
  status: MealAnalysisStatus;
  analysis: MealAnalysisPreview | null;
}>;

export type SnapNutrientValues = Readonly<
  Pick<MealAnalysisResult, 'carbsG' | 'fatG' | 'satFatG' | 'fiberG' | 'sugarG' | 'sodiumMg' | 'potassiumMg'>
>;

export type SnapPhoto = Readonly<{
  FILE: File | null;
  PREVIEW_URL: string;
}>;

export type SnapCameraFacing = 'user' | 'environment';

export type SnapCameraDialogProps = Readonly<{
  allowBackCamera: boolean;
  onCapture: (file: File) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}>;

export type UseSnapPhotoResult = Readonly<{
  photo: SnapPhoto | null;
  setPhoto: (file: File | null) => void;
}>;

export type SnapAnalysisState =
  | Readonly<{ STATUS: typeof SNAP_ANALYSIS_STATUS.IDLE }>
  | Readonly<{ STATUS: typeof SNAP_ANALYSIS_STATUS.LOADING }>
  | Readonly<{
      STATUS: typeof SNAP_ANALYSIS_STATUS.SUCCESS;
      LOCKED: true;
      LOCKED_REASON: typeof SNAP_LOCKED_REASON.PLAN;
      ANALYSIS_ID: string;
      ANALYSIS: MealAnalysisLockedResult;
    }>
  | Readonly<{
      STATUS: typeof SNAP_ANALYSIS_STATUS.SUCCESS;
      LOCKED: true;
      LOCKED_REASON: typeof SNAP_LOCKED_REASON.DAILY_LIMIT;
      ANALYSIS_ID: string;
    }>
  | Readonly<{
      STATUS: typeof SNAP_ANALYSIS_STATUS.SUCCESS;
      LOCKED: false;
      ANALYSIS: MealAnalysisResult;
      ANALYSIS_ID: string;
    }>
  | Readonly<{ STATUS: typeof SNAP_ANALYSIS_STATUS.ERROR; MESSAGE: string }>
  | Readonly<{ STATUS: typeof SNAP_ANALYSIS_STATUS.PLAN_REQUIRED }>;

export type UseSnapAnalyzeResult = Readonly<{
  analysisState: SnapAnalysisState;
  analyzePhoto: () => Promise<void>;
  completePendingAnalysis: (analysisId: string) => Promise<void>;
  resetAnalysis: () => void;
}>;

export type UseSnapSavedMealLoaderResult = Readonly<{
  loadingSavedMeal: boolean;
}>;

export type SnapAnalyzeSuccessResponse = Readonly<{
  analysis: MealAnalysisPreview;
  id: string;
}>;

export type SnapAnalyzeErrorResponse = Readonly<{
  error?: string;
  id?: string;
  retryAfterSeconds?: number;
  pendingLimit?: true;
  planRequired?: true;
}>;

export type SnapAnalysisReadoutProps = Readonly<{
  analysisState: SnapAnalysisState;
  photo: SnapPhoto;
  onRetry?: () => void;
}>;

export type SnapAnalysisUnlockedReadoutProps = Readonly<{
  analysis: MealAnalysisResult;
  previewUrl: string;
}>;

export type SnapLockedPlaceholderProps = Readonly<{
  value: string;
  className?: string;
}>;

export type SnapLockedNutrientTileProps = HeroStatTileChrome &
  Readonly<{
    decoyValue?: string;
  }>;

export type SnapPhotoActionsProps = Readonly<{
  disabled: boolean;
  onReplace: () => void;
  onCamera: () => void;
  onRemove: () => void;
}>;

export type SnapMealPhotoCardProps = Readonly<{
  previewUrl: string;
  photoActions?: Omit<SnapPhotoActionsProps, 'disabled'>;
  photoActionsDisabled?: boolean;
}>;

export type SnapStageGridProps = Readonly<{
  photo: SnapPhoto;
  right: ReactNode;
  photoActions?: Omit<SnapPhotoActionsProps, 'disabled'>;
  photoActionsDisabled?: boolean;
}>;

export type SnapAnalyzeCtaProps = Readonly<{
  onAnalyze: () => void;
}>;

export type SnapPanelStageKey = (typeof SNAP_PANEL_STAGE)[keyof typeof SNAP_PANEL_STAGE];

export type SnapPanelStageKeyInput = Readonly<{
  analysisState: SnapAnalysisState;
  hasPhoto: boolean;
  loadingSavedMeal: boolean;
}>;

/** One spring target for the upload zone, mirroring `NAV_BAR_REST` / `NAV_BAR_CONDENSED`. */
export type SnapUploadZoneGeometry = Readonly<{
  borderRadius: number;
  paddingLeft: number;
  paddingRight: number;
  scale: number;
  y: number;
}>;

export type SnapUploadZoneRing = Readonly<{
  /** Bumped per click so `AnimatePresence` replays the ripple instead of reusing the node. */
  ID: number;
  /** Pointer position inside the zone, as a percentage of its box. */
  X_PERCENT: number;
  Y_PERCENT: number;
}>;

export type SnapUploadZoneDragHandlers = Readonly<{
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}>;

export type SnapUploadZoneProps = Readonly<{
  actions: ReactNode;
  description: string;
  /** Omitted on phones, where there is no drop target to hint at. */
  hint?: string;
  /** Desktop only: enables hover, tilt, the dashed 4px edge and the drag handlers. */
  interactive: boolean;
  isDragging: boolean;
  onClick: (event: MouseEvent<HTMLDivElement>) => void;
  title: string;
  dragHandlers?: SnapUploadZoneDragHandlers;
}>;

export type SnapHeaderProps = Readonly<{
  className?: string;
}>;

export type SnapPhotoStageProps = Readonly<{
  photo: SnapPhoto;
  onAnalyze: () => void;
  photoActions: Omit<SnapPhotoActionsProps, 'disabled'>;
}>;

export type SnapPlanRequiredStageProps = Readonly<{
  photo: SnapPhoto;
  photoActions: Omit<SnapPhotoActionsProps, 'disabled'>;
}>;

export type SnapAnalysisStageProps = Readonly<{
  analysisState: SnapAnalysisState;
  photo: SnapPhoto;
  photoActions: Omit<SnapPhotoActionsProps, 'disabled'>;
  photoActionsDisabled: boolean;
  onRetry?: () => void;
}>;

export type SnapHeadingCopy = Readonly<{
  TITLE: string;
  SUBTITLE: string;
  PHASE: SnapHeadingPhase;
}>;
