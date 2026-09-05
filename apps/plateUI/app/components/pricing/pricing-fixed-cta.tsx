'use client';

import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';
import { isPaidPlan, isPlanUpgrade, isPurchasablePlan } from '@plate/plate-billing/utils';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { PRICING_PAGE, PRICING_SECTION } from './constants';
import { usePricingActiveTierId, usePricingPurchase } from './hooks';
import type { PricingFixedCtaProps } from './types';
import {
  buildPricingPurchaseCtaLabel,
  buildPricingUpgradeCtaLabel,
  getPricingTierById,
} from './utils';

export function PricingFixedCta({ currentPlanId = null }: PricingFixedCtaProps) {
  const activeTierId = usePricingActiveTierId();
  const activeTier = getPricingTierById(activeTierId);
  const { purchase, isPurchasing, error } = usePricingPurchase();
  const isCurrentPlan = currentPlanId != null && activeTierId === currentPlanId;
  const isUpgradeTarget = isCurrentPlan && currentPlanId === SUBSCRIPTION_PLAN.BASIC;
  const canPurchaseUpgrade = currentPlanId == null || isPlanUpgrade(activeTier.ID, currentPlanId);
  const upgradeTier = getPricingTierById(SUBSCRIPTION_PLAN.PRO);
  const isPurchasable = isPurchasablePlan(activeTier.ID);
  const isContactOnly = isPaidPlan(activeTier.ID) && !isPurchasable;

  let ctaLabel: string;
  let ctaTier = activeTier;
  let ctaMode: 'button' | 'contact' | 'note' = 'button';

  if (isUpgradeTarget) {
    ctaTier = upgradeTier;
    ctaLabel = buildPricingUpgradeCtaLabel(ctaTier);
  } else if (isCurrentPlan) {
    ctaMode = 'note';
    ctaLabel = PRICING_SECTION.CURRENT_PLAN_NOTE;
  } else if (isContactOnly) {
    ctaMode = 'contact';
    ctaLabel = PRICING_SECTION.CONTACT_US;
  } else if (isPurchasable && canPurchaseUpgrade) {
    ctaLabel = buildPricingPurchaseCtaLabel(activeTier);
  } else if (isPurchasable) {
    ctaMode = 'note';
    ctaLabel = PRICING_SECTION.ALREADY_INCLUDED;
  } else {
    ctaLabel = PRICING_SECTION.FREE_PLAN_CTA;
  }

  const showCheckoutNote = ctaMode === 'button';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex flex-col items-center gap-1.5">
        {ctaMode === 'note' ? (
          <span className="inline-flex h-12 items-center justify-center rounded-lg border border-edge bg-surface px-6 text-sm font-medium sm:h-14 sm:px-7 sm:text-base">
            {ctaLabel}
          </span>
        ) : ctaMode === 'contact' ? (
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
            disabled={!isPurchasablePlan(ctaTier.ID) || isPurchasing}
            aria-disabled={!isPurchasablePlan(ctaTier.ID) || isPurchasing}
            aria-label={ctaLabel}
            className="text-button-default-fg h-12 gap-2 px-6 text-base sm:h-14 sm:px-7 sm:text-lg"
            onClick={() => {
              purchase(ctaTier);
            }}
          >
            <span aria-live="polite">{isPurchasing ? 'Redirecting to checkout…' : ctaLabel}</span>
          </ShimmerButton>
        )}
        <p className="text-muted-foreground text-center text-xs" role="status">
          {error ?? (showCheckoutNote ? PRICING_SECTION.CHECKOUT_NOTE : null)}
        </p>
      </div>
    </div>
  );
}
