'use client';

import { isPaidPlan, isPurchasablePlan } from '@plate/plate-billing/utils';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { PRICING_PAGE, PRICING_SECTION } from './constants';
import { usePricingActiveTierId, usePricingPurchase } from './hooks';
import { buildPricingPurchaseCtaLabel, getPricingTierById } from './utils';

export function PricingFixedCta() {
  const activeTierId = usePricingActiveTierId();
  const activeTier = getPricingTierById(activeTierId);
  const { purchase, isPurchasing, error } = usePricingPurchase();
  const isPurchasable = isPurchasablePlan(activeTier.ID);
  const isContactOnly = isPaidPlan(activeTier.ID) && !isPurchasable;
  const ctaLabel = isContactOnly
    ? PRICING_SECTION.CONTACT_US
    : isPurchasable
      ? buildPricingPurchaseCtaLabel(activeTier)
      : PRICING_SECTION.FREE_PLAN_CTA;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex flex-col items-center gap-1.5">
        {isContactOnly ? (
          <a
            href={PRICING_SECTION.CONTACT_US_HREF}
            className="text-button-default-fg inline-flex h-12 items-center justify-center rounded-lg px-6 text-base font-medium sm:h-14 sm:px-7 sm:text-lg"
            style={{ background: PRICING_PAGE.FIXED_CTA_SHIMMER_BACKGROUND }}
          >
            {ctaLabel}
          </a>
        ) : (
          <ShimmerButton
            type="button"
            background={PRICING_PAGE.FIXED_CTA_SHIMMER_BACKGROUND}
            shimmerColor={PRICING_PAGE.FIXED_CTA_SHIMMER_COLOR}
            shimmerSize="2px"
            disabled={!isPurchasable || isPurchasing}
            aria-disabled={!isPurchasable || isPurchasing}
            aria-label={ctaLabel}
            className="text-button-default-fg h-12 gap-2 px-6 text-base sm:h-14 sm:px-7 sm:text-lg"
            onClick={() => {
              purchase(activeTier);
            }}
          >
            <span aria-live="polite">{isPurchasing ? 'Redirecting to checkout…' : ctaLabel}</span>
          </ShimmerButton>
        )}
        <p className="text-muted-foreground text-center text-xs" role="status">
          {error ?? (isContactOnly ? null : PRICING_SECTION.CHECKOUT_NOTE)}
        </p>
      </div>
    </div>
  );
}
