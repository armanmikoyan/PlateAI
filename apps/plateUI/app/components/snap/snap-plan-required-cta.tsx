'use client';

import Link from 'next/link';
import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';
import { buildPricingTierHref } from '@/app/components/pricing/utils';
import { Card, CardContent } from '@/app/ui/card';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { cn } from '@/app/utils/cn';
import {
  SNAP,
  SNAP_PHOTO_CARD_SHELL,
  SNAP_STAGE_CARD_CONTENT_CLASS,
  SNAP_STAGE_CARD_SURFACE_CLASS,
} from './constants';
import { SnapStageDots } from './snap-stage-dots';

export function SnapPlanRequiredCta() {
  return (
    <Card className={cn('border-dashed', SNAP_PHOTO_CARD_SHELL, SNAP_STAGE_CARD_SURFACE_CLASS)}>
      <SnapStageDots />
      <CardContent
        className={cn(
          'flex h-full flex-col items-center justify-center gap-4 p-6',
          SNAP_STAGE_CARD_CONTENT_CLASS,
        )}
      >
        <Link href={buildPricingTierHref(SUBSCRIPTION_PLAN.PRO)}>
          <ShimmerButton
            type="button"
            background={SNAP.PAYWALL_CTA_SHIMMER_BACKGROUND}
            shimmerColor={SNAP.PAYWALL_CTA_SHIMMER_COLOR}
            shimmerSize="2px"
            className="text-button-default-fg h-9 px-6 text-sm"
          >
            {SNAP.PAYWALL_CTA}
          </ShimmerButton>
        </Link>
      </CardContent>
    </Card>
  );
}
