'use client';

import { isPaidPlan } from '@plate/plate-billing';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { PRICING_PAGE, PRICING_SECTION } from './constants';
import { usePricingActiveTierId, usePricingPurchase } from './hooks';
import { buildPricingPurchaseCtaLabel, getPricingTierById } from './utils';

export function PricingFixedCta() {
  const activeTierId = usePricingActiveTierId();
  const activeTier = getPricingTierById(activeTierId);
  const { purchase, isPurchasing, error } = usePricingPurchase();
  const isFreeTier = !isPaidPlan(activeTier.ID);
  const ctaLabel = isFreeTier ? PRICING_SECTION.FREE_PLAN_CTA : buildPricingPurchaseCtaLabel(activeTier);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex flex-col items-center gap-1.5">
        <ShimmerButton
          type="button"
          background={PRICING_PAGE.FIXED_CTA_SHIMMER_BACKGROUND}
          shimmerColor={PRICING_PAGE.FIXED_CTA_SHIMMER_COLOR}
          shimmerSize="2px"
          disabled={isFreeTier || isPurchasing}
          aria-disabled={isFreeTier || isPurchasing}
          aria-label={ctaLabel}
          className="text-button-default-fg h-12 gap-2 px-6 text-base sm:h-14 sm:px-7 sm:text-lg"
          onClick={() => {
            purchase(activeTier);
          }}
        >
          <span aria-live="polite">{isPurchasing ? 'Redirecting to checkout…' : ctaLabel}</span>
        </ShimmerButton>
        <p className="text-muted-foreground text-center text-xs" role="status">
          {error ?? PRICING_SECTION.CHECKOUT_NOTE}
        </p>
      </div>
    </div>
  );
}
