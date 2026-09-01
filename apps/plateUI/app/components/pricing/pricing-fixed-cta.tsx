'use client';

import { ShimmerButton } from '@/app/ui/shimmer-button';

import { PRICING_PAGE, PRICING_SECTION } from './constants';
import { usePricingActiveTierId } from './hooks';
import { buildPricingPurchaseCtaLabel, getPricingTierById } from './utils';

export function PricingFixedCta() {
  const activeTierId = usePricingActiveTierId();
  const activeTier = getPricingTierById(activeTierId);
  const ctaLabel = buildPricingPurchaseCtaLabel(activeTier);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex flex-col items-center gap-1.5">
        <ShimmerButton
          type="button"
          background={PRICING_PAGE.FIXED_CTA_SHIMMER_BACKGROUND}
          shimmerColor={PRICING_PAGE.FIXED_CTA_SHIMMER_COLOR}
          shimmerSize="2px"
          disabled
          aria-disabled
          aria-label={ctaLabel}
          className="text-button-default-fg h-12 cursor-not-allowed gap-2 px-6 text-base disabled:opacity-100 sm:h-14 sm:px-7 sm:text-lg"
        >
          <span aria-live="polite">{ctaLabel}</span>
        </ShimmerButton>
        <p className="text-muted-foreground text-center text-xs">{PRICING_SECTION.CHECKOUT_NOTE}</p>
      </div>
    </div>
  );
}
