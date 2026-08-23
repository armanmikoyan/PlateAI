import { PRICING_PAGE } from './constants';
import { PricingTierFeatureList } from './pricing-tier-feature-list';
import type { PricingTierCardDetailProps } from './types';

export function PricingTierCardDetail({ tier }: PricingTierCardDetailProps) {
  return (
    <div className="border-edge/80 mt-6 border-t pt-6">
      <p className="text-content-muted text-sm/relaxed sm:text-base">{tier.DETAIL_BODY}</p>
      <div className="mt-5">
        <p className="text-content text-sm font-semibold">{PRICING_PAGE.IDEAL_FOR_LABEL}</p>
        <p className="text-content-muted mt-1 text-sm/relaxed">{tier.IDEAL_FOR}</p>
      </div>
      <div className="mt-6">
        <PricingTierFeatureList lines={tier.DETAIL_HIGHLIGHTS} />
      </div>
    </div>
  );
}
