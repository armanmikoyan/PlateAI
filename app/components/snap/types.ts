import type { ReactNode } from 'react';
import type { MealImageAnalysis } from '@/lib/ai/types';
import type { HeroStatTileChrome } from '@/app/components/hero/constants';
import { SNAP_ANALYSIS_STATUS, type SnapHeadingPhase } from './constants';

export type SnapPhoto = Readonly<{
  FILE: File;
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
  | Readonly<{ STATUS: typeof SNAP_ANALYSIS_STATUS.SUCCESS; ANALYSIS: MealImageAnalysis }>
  | Readonly<{ STATUS: typeof SNAP_ANALYSIS_STATUS.ERROR; MESSAGE: string }>;

export type UseSnapAnalyzeResult = Readonly<{
  analysisState: SnapAnalysisState;
  analyzePhoto: () => Promise<void>;
  resetAnalysis: () => void;
}>;

export type SnapAnalyzeSuccessResponse = Readonly<{
  analysis: MealImageAnalysis;
}>;

export type SnapAnalyzeErrorResponse = Readonly<{
  error?: string;
}>;

export type SnapAnalysisReadoutProps = Readonly<{
  analysisState: SnapAnalysisState;
  photo: SnapPhoto;
}>;

export type SnapAnalysisPaywallProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export type SnapLockedValueProps = Readonly<{
  value: string;
  className?: string;
}>;

export type SnapLockedNutrientTileProps = HeroStatTileChrome &
  Readonly<{
    value: string;
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

export type SnapHeaderProps = Readonly<{
  className?: string;
}>;

export type SnapPhotoStageProps = Readonly<{
  photo: SnapPhoto;
  onAnalyze: () => void;
  photoActions: Omit<SnapPhotoActionsProps, 'disabled'>;
}>;

export type SnapAnalysisStageProps = Readonly<{
  analysisState: SnapAnalysisState;
  photo: SnapPhoto;
  photoActions: Omit<SnapPhotoActionsProps, 'disabled'>;
  photoActionsDisabled: boolean;
}>;

export type SnapHeadingCopy = Readonly<{
  TITLE: string;
  SUBTITLE: string;
  PHASE: SnapHeadingPhase;
}>;

export type { AcceptedImageType, SnapAnalysisStatus, SnapHeadingPhase } from './constants';
