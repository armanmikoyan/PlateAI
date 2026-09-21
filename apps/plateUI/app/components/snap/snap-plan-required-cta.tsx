'use client';

import Link from 'next/link';
import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';
import { buildPricingTierHref } from '@/app/components/pricing/utils';
import { Card, CardContent } from '@/app/ui/card';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { cn } from '@/app/utils/cn';
import { SNAP, SNAP_PHOTO_CARD_SHELL } from './constants';

export function SnapPlanRequiredCta() {
  return (
    <Card className={cn('h-full border-dashed', SNAP_PHOTO_CARD_SHELL)}>
      <CardContent className="flex h-full flex-col items-center justify-center gap-4 p-6">
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
