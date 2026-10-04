'use client';

import { SNAP_STAGE_CELL_CLASS, SNAP_STAGE_GRID_SHELL, SNAP_STAGE_MIN_HEIGHT_CLASS } from './constants';
import { HeroBetweenCardsArrow } from '@/app/components/hero/hero-between-cards-arrow';
import { cn } from '@/app/utils/cn';
import { SnapMealPhotoCard } from './snap-meal-photo-card';
import { SnapAnalysisReadout } from './snap-analysis-readout';
import { SnapAnalyzeCta } from './snap-analyze-cta';
import { SnapPlanRequiredCta } from './snap-plan-required-cta';
import type {
  SnapAnalysisStageProps,
  SnapPhotoStageProps,
  SnapPlanRequiredStageProps,
  SnapStageGridProps,
} from './types';

function SnapStageGrid({ photo, right, photoActions, photoActionsDisabled }: SnapStageGridProps) {
  return (
    <div className={cn(SNAP_STAGE_GRID_SHELL, SNAP_STAGE_MIN_HEIGHT_CLASS)}>
      <div className={SNAP_STAGE_CELL_CLASS}>
        <SnapMealPhotoCard
          key={photo.PREVIEW_URL}
          previewUrl={photo.PREVIEW_URL}
          photoActions={photoActions}
          photoActionsDisabled={photoActionsDisabled}
        />
      </div>
      <div className="self-center">
        <HeroBetweenCardsArrow />
      </div>
      <div className={SNAP_STAGE_CELL_CLASS}>{right}</div>
    </div>
  );
}

export function SnapPhotoStage({ photo, onAnalyze, photoActions }: SnapPhotoStageProps) {
  return (
    <SnapStageGrid
      photo={photo}
      photoActions={photoActions}
      right={<SnapAnalyzeCta onAnalyze={onAnalyze} />}
    />
  );
}

export function SnapPlanRequiredStage({ photo, photoActions }: SnapPlanRequiredStageProps) {
  return <SnapStageGrid photo={photo} photoActions={photoActions} right={<SnapPlanRequiredCta />} />;
}

export function SnapAnalysisStage({
  analysisState,
  photo,
  photoActions,
  photoActionsDisabled,
  onRetry,
}: SnapAnalysisStageProps) {
  return (
    <SnapStageGrid
      photo={photo}
      photoActions={photoActions}
      photoActionsDisabled={photoActionsDisabled}
      right={<SnapAnalysisReadout analysisState={analysisState} photo={photo} onRetry={onRetry} />}
    />
  );
}
