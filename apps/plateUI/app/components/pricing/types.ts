import { PRICING_COMPARISON_ROWS, PRICING_TIERS } from './constants';

export type PricingTierRow = (typeof PRICING_TIERS)[number];

export type PricingComparisonRow = (typeof PRICING_COMPARISON_ROWS)[number];

export type PricingTierCardVariant = 'preview' | 'detail';

export type PricingTierCardProps = Readonly<{
  tier: PricingTierRow;
  variant: PricingTierCardVariant;
  isSelected?: boolean;
  hasActiveSelection?: boolean;
}>;

export type PricingTierGridProps = Readonly<{
  variant: PricingTierCardVariant;
}>;

export type PricingTierCardDetailProps = Readonly<{
  tier: PricingTierRow;
}>;

export type UsePricingSelectTier = (tierId: string) => void;
