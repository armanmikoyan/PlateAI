'use client';

import { Lock } from 'lucide-react';
import Link from 'next/link';
import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';
import { buildPricingTierHref } from '@/app/components/pricing/utils';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { SNAP } from './constants';

export function SnapAnalysisUnlockButton() {
  return (
    <Link href={buildPricingTierHref(SUBSCRIPTION_PLAN.PRO)} aria-label={SNAP.PAYWALL_ARIA}>
      <ShimmerButton
        type="button"
        background={SNAP.PAYWALL_CTA_SHIMMER_BACKGROUND}
        shimmerColor={SNAP.PAYWALL_CTA_SHIMMER_COLOR}
        shimmerSize="2px"
        className="text-button-default-fg h-9 px-6 text-sm"
      >
        <Lock className="size-4 shrink-0" aria-hidden />
        {SNAP.UNLOCK_CTA}
      </ShimmerButton>
    </Link>
  );
}
