'use client';

import Image from 'next/image';
import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';
import { buildPricingTierHref } from '@/app/components/pricing/utils';
import { Badge } from '@/app/ui/badge';
import { Card, CardContent } from '@/app/ui/card';
import { cn } from '@/app/utils/cn';
import {
  SNAP,
  SNAP_ANALYSIS_STATUS,
  SNAP_ANALYSIS_CARD_SHELL,
  SNAP_LOCKED_DECOY,
  SNAP_PHOTO_CARD_SHELL,
} from './constants';
import { SnapAnalysisLockedPreview } from './snap-analysis-locked-preview';
import { SnapAnalysisUnlockCta } from './snap-analysis-unlock-cta';
import { SnapAnalysisUnlockedReadout } from './snap-analysis-unlocked-readout';
import { SnapLockedPlaceholder } from './snap-locked-placeholder';
import type { SnapAnalysisReadoutProps } from './types';

function SnapAnalysisLockedHeader({ previewUrl }: Readonly<{ previewUrl: string }>) {
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
          <SnapLockedPlaceholder value={SNAP_LOCKED_DECOY.MEAL_NAME} />
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

function SnapAnalysisLockedCard({ photo }: Readonly<{ photo: SnapAnalysisReadoutProps['photo'] }>) {
  return (
    <Card
      className={cn(
        '@container/result flex w-full cursor-pointer flex-col transition-shadow motion-reduce:transition-none hover:shadow-md',
        SNAP_ANALYSIS_CARD_SHELL,
      )}
      aria-live="polite"
    >
      <CardContent className="relative flex flex-col gap-0 p-0">
        <SnapAnalysisLockedHeader previewUrl={photo.PREVIEW_URL} />
        <SnapAnalysisLockedPreview />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/40">
          <SnapAnalysisUnlockCta />
        </div>
      </CardContent>
    </Card>
  );
}

export function SnapAnalysisReadout({ analysisState, photo }: SnapAnalysisReadoutProps) {
  if (analysisState.STATUS === SNAP_ANALYSIS_STATUS.ERROR) {
    return (
      <Card
        className={cn('@container/result flex h-full w-full flex-col', SNAP_PHOTO_CARD_SHELL)}
        aria-live="polite"
      >
        <CardContent className="flex flex-1 items-center justify-center p-6 text-center text-sm text-destructive">
          {analysisState.MESSAGE}
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

  if (analysisState.LOCKED === false) {
    return (
      <Card
        className={cn('@container/result flex w-full flex-col', SNAP_ANALYSIS_CARD_SHELL)}
        aria-live="polite"
      >
        <CardContent className="flex flex-col gap-0 p-0">
          <SnapAnalysisUnlockedReadout
            analysis={analysisState.ANALYSIS}
            previewUrl={photo.PREVIEW_URL}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link
      href={buildPricingTierHref(SUBSCRIPTION_PLAN.PRO)}
      aria-label={SNAP.PAYWALL_ARIA}
      className="block w-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <SnapAnalysisLockedCard photo={photo} />
    </Link>
  );
}
