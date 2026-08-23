'use client';

import { Card, CardContent } from '@/app/ui/card';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { cn } from '@/lib/utils';
import { SNAP, SNAP_PHOTO_CARD_SHELL } from './constants';
import type { SnapAnalyzeCtaProps } from './types';

export function SnapAnalyzeCta({ onAnalyze }: SnapAnalyzeCtaProps) {
  return (
    <Card className={cn('h-full border-dashed', SNAP_PHOTO_CARD_SHELL)}>
      <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-6">
        <ShimmerButton
          type="button"
          background="linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)"
          shimmerColor="var(--color-content)"
          shimmerSize="2px"
          className="text-button-default-fg h-9 px-5 text-sm"
          onClick={() => {
            onAnalyze();
          }}
        >
          {SNAP.ANALYZE_CTA}
        </ShimmerButton>
      </CardContent>
    </Card>
  );
}
