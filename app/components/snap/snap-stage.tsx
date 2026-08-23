'use client';

import { SNAP_STAGE_GRID_SHELL } from './constants';
import { HeroBetweenCardsArrow } from '@/app/components/hero/hero-between-cards-arrow';
import { SnapMealPhotoCard } from './snap-meal-photo-card';
import { SnapAnalysisReadout } from './snap-analysis-readout';
import { SnapAnalyzeCta } from './snap-analyze-cta';
import type { SnapAnalysisStageProps, SnapPhotoStageProps, SnapStageGridProps } from './types';

function SnapStageGrid({
  photo,
  right,
  photoActions,
  photoActionsDisabled,
}: SnapStageGridProps) {
  return (
    <div className={SNAP_STAGE_GRID_SHELL}>
      <div className="relative z-0 w-full min-w-0">
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
      <div className="relative z-0 w-full min-w-0">{right}</div>
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

export function SnapAnalysisStage({
  analysisState,
  photo,
  photoActions,
  photoActionsDisabled,
}: SnapAnalysisStageProps) {
  return (
    <SnapStageGrid
      photo={photo}
      photoActions={photoActions}
      photoActionsDisabled={photoActionsDisabled}
      right={<SnapAnalysisReadout analysisState={analysisState} photo={photo} />}
    />
  );
}
