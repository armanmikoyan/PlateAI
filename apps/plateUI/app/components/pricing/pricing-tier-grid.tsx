'use client';

import { useRef } from 'react';

import { PRICING_PAGE, PRICING_TIERS } from './constants';
import { usePricingActiveTierId, usePricingTierShellMinHeight } from './hooks';
import { PricingTierCard } from './pricing-tier-card';
import type { PricingTierGridProps } from './types';
import { buildPricingPlanCardId } from './utils';

export function PricingTierGrid({ variant }: PricingTierGridProps) {
  const activeTierId = usePricingActiveTierId();
  const gridRef = useRef<HTMLUListElement>(null);

  usePricingTierShellMinHeight(gridRef, variant === 'detail');

  return (
    <ul
      ref={gridRef}
      id={variant === 'detail' ? PRICING_PAGE.PLANS_SECTION_ID : undefined}
      className={
        variant === 'detail'
          ? 'mt-12 grid list-none grid-cols-1 items-start gap-5 scroll-mt-28 md:grid-cols-3 md:gap-6 lg:mt-14'
          : 'mt-12 grid list-none grid-cols-1 gap-5 scroll-mt-28 md:grid-cols-3 md:gap-6 lg:mt-14'
      }
    >
      {PRICING_TIERS.map((tier) => (
        <li
          key={tier.ID}
          id={variant === 'detail' ? buildPricingPlanCardId(tier.ID) : undefined}
          className={variant === 'detail' ? 'min-w-0 scroll-mt-28' : 'h-full min-w-0 scroll-mt-28'}
        >
          <PricingTierCard
            hasActiveSelection={variant === 'detail'}
            isSelected={variant === 'detail' && activeTierId === tier.ID}
            tier={tier}
            variant={variant}
          />
        </li>
      ))}
    </ul>
  );
}
