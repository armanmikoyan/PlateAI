'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { RefreshCw, ScanLine } from 'lucide-react';
import { Badge } from '@/app/ui/badge';
import { Button } from '@/app/ui/button';
import { Card, CardContent } from '@/app/ui/card';
import { cn } from '@/app/utils/cn';
import {
  SNAP,
  SNAP_ANALYSIS_PLACEHOLDER,
  SNAP_ANALYSIS_STATUS,
  SNAP_ANALYSIS_CARD_SHELL,
  SNAP_LOCKED_DECOY,
  SNAP_LOCKED_REASON,
  SNAP_PHOTO_CARD_SHELL,
} from './constants';
import { SnapAnalysisLockedPreview } from './snap-analysis-locked-preview';
import { SnapAnalysisUnlockedReadout } from './snap-analysis-unlocked-readout';
import { SnapLockedPlaceholder } from './snap-locked-placeholder';
import { SnapOrbLoader } from './snap-orb-loader';
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

function SnapAnalysisPlaceholderCard() {
  return (
    <Card
      className={cn(
        '@container/result flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center',
        SNAP_PHOTO_CARD_SHELL,
      )}
    >
      <ScanLine className="text-content-subtle size-8" aria-hidden />
      <p className="font-heading text-content text-base font-semibold tracking-tight">
        {SNAP_ANALYSIS_PLACEHOLDER.TITLE}
      </p>
      <p className="text-muted-foreground max-w-56 text-sm">{SNAP_ANALYSIS_PLACEHOLDER.BODY}</p>
    </Card>
  );
}

function snapReadoutStageKey(analysisState: SnapAnalysisState): string {
  switch (analysisState.STATUS) {
    case SNAP_ANALYSIS_STATUS.LOADING:
      return 'loading';
    case SNAP_ANALYSIS_STATUS.ERROR:
      return 'error';
    case SNAP_ANALYSIS_STATUS.SUCCESS:
      return 'success';
    default:
      return 'idle';
  }
}

export function SnapAnalysisReadout({ analysisState, photo, onRetry }: SnapAnalysisReadoutProps) {
  let content: ReactNode | null = null;

  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.ERROR) {
    content = (
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
  } else if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.LOADING) {
    content = <SnapOrbLoader />;
  } else if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS && analysisState.LOCKED === false) {
    content = (
      <Card
        className={cn('@container/result flex w-full flex-col', SNAP_ANALYSIS_CARD_SHELL)}
        aria-live="polite"
      >
        <CardContent className="flex flex-col gap-0 p-0">
          <SnapAnalysisUnlockedReadout analysis={analysisState.ANALYSIS} previewUrl={photo.PREVIEW_URL} />
        </CardContent>
      </Card>
    );
  } else if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.SUCCESS) {
    content = (
      <Card
        className={cn('@container/result flex w-full flex-col', SNAP_ANALYSIS_CARD_SHELL)}
        aria-live="polite"
      >
        <CardContent className="flex flex-col gap-0 p-0">
          <SnapAnalysisLockedCard photo={photo} analysisState={analysisState} />
        </CardContent>
      </Card>
    );
  } else {
    content = <SnapAnalysisPlaceholderCard />;
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      {content ? (
        <motion.div
          key={snapReadoutStageKey(analysisState)}
          className="flex w-full min-w-0"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {content}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
