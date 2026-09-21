'use client';

import Image from 'next/image';
import { LoaderCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/app/ui/badge';
import { Button } from '@/app/ui/button';
import { Card, CardContent } from '@/app/ui/card';
import { cn } from '@/app/utils/cn';
import {
  SNAP,
  SNAP_ANALYSIS_STATUS,
  SNAP_ANALYSIS_CARD_SHELL,
  SNAP_LOCKED_DECOY,
  SNAP_LOCKED_REASON,
  SNAP_PHOTO_CARD_SHELL,
} from './constants';
import { SnapAnalysisLockedPreview } from './snap-analysis-locked-preview';
import { SnapAnalysisUnlockedReadout } from './snap-analysis-unlocked-readout';
import { SnapLockedPlaceholder } from './snap-locked-placeholder';
import type { SnapAnalysisReadoutProps, SnapAnalysisState } from './types';

function SnapAnalysisLockedHeader({
  previewUrl,
  mealName,
}: Readonly<{ previewUrl: string; mealName: string | null }>) {
  return (
    <div className="border-edge flex shrink-0 min-w-0 items-start gap-3 border-b px-4 py-3 sm:px-5">
      <span className="relative size-14 shrink-0 overflow-hidden rounded-lg sm:size-16">
        <Image
          src={previewUrl}
          alt={SNAP.PREVIEW_ALT}
          fill
          unoptimized
          sizes="64px"
          className="object-cover"
        />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <Badge variant="ghost">{SNAP.ANALYSIS_DETECTED}</Badge>
        <p className="font-heading mt-1.5 text-base font-semibold tracking-tight sm:text-lg">
          {mealName ? mealName : <SnapLockedPlaceholder value={SNAP_LOCKED_DECOY.MEAL_NAME} />}
        </p>
      </div>
    </div>
  );
}

function SnapAnalysisLoadingCard() {
  return (
    <Card
      className={cn('@container/result flex h-full w-full flex-col', SNAP_PHOTO_CARD_SHELL)}
      aria-live="polite"
      aria-busy
    >
      <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <LoaderCircle className="text-muted-foreground size-8 animate-spin" aria-hidden />
        <p className="text-muted-foreground text-sm">{SNAP.ANALYZING}</p>
      </CardContent>
    </Card>
  );
}

function SnapAnalysisLockedCard({
  photo,
  analysisState,
}: Readonly<{
  photo: SnapAnalysisReadoutProps['photo'];
  analysisState: SnapAnalysisState;
}>) {
  const analysis =
    analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS &&
    analysisState.LOCKED === true &&
    analysisState.LOCKED_REASON === SNAP_LOCKED_REASON.PLAN
      ? analysisState.ANALYSIS
      : null;

  return (
    <Card
      className={cn('@container/result flex w-full flex-col', SNAP_ANALYSIS_CARD_SHELL)}
      aria-live="polite"
    >
      <CardContent className="flex flex-col gap-0 p-0">
        <SnapAnalysisLockedHeader previewUrl={photo.PREVIEW_URL} mealName={analysis?.mealName ?? null} />
        <SnapAnalysisLockedPreview analysis={analysis} />
      </CardContent>
    </Card>
  );
}

export function SnapAnalysisReadout({ analysisState, photo, onRetry }: SnapAnalysisReadoutProps) {
  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.ERROR) {
    return (
      <Card
        className={cn('@container/result flex h-full w-full flex-col', SNAP_PHOTO_CARD_SHELL)}
        aria-live="polite"
      >
        <CardContent className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-destructive text-sm">{analysisState.MESSAGE}</p>
          {onRetry ? (
            <Button type="button" variant="outline" onClick={onRetry}>
              <RefreshCw />
              {SNAP.ANALYSIS_RETRY}
            </Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.IDLE) {
    return null;
  }

  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.LOADING) {
    return <SnapAnalysisLoadingCard />;
  }

  if (analysisState.STATUS !== SNAP_ANALYSIS_STATUS.SUCCESS) {
    return null;
  }

  if (analysisState.LOCKED === false) {
    return (
      <Card
        className={cn('@container/result flex w-full flex-col', SNAP_ANALYSIS_CARD_SHELL)}
        aria-live="polite"
      >
        <CardContent className="flex flex-col gap-0 p-0">
          <SnapAnalysisUnlockedReadout analysis={analysisState.ANALYSIS} previewUrl={photo.PREVIEW_URL} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn('@container/result flex w-full flex-col', SNAP_ANALYSIS_CARD_SHELL)}
      aria-live="polite"
    >
      <CardContent className="flex flex-col gap-0 p-0">
        <SnapAnalysisLockedCard photo={photo} analysisState={analysisState} />
      </CardContent>
    </Card>
  );
}
