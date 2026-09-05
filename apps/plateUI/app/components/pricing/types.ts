import { PRICING_COMPARISON_ROWS, PRICING_TIERS } from './constants';
import type { SubscriptionPlan } from '@plate/plate-billing/types';

export type PricingTierRow = (typeof PRICING_TIERS)[number];

export type PricingComparisonRow = (typeof PRICING_COMPARISON_ROWS)[number];

export type PricingTierCardVariant = 'preview' | 'detail';

export type PricingTierCardProps = Readonly<{
  tier: PricingTierRow;
  variant: PricingTierCardVariant;
  isSelected?: boolean;
  hasActiveSelection?: boolean;
  currentPlanId?: SubscriptionPlan | null;
}>;

export type PricingTierGridProps = Readonly<{
  variant: PricingTierCardVariant;
  currentPlanId?: SubscriptionPlan | null;
}>;

export type PricingPageProps = Readonly<{
  currentPlanId?: SubscriptionPlan | null;
}>;

export type PricingSectionProps = Readonly<{
  currentPlanId?: SubscriptionPlan | null;
}>;

export type PricingFixedCtaProps = Readonly<{
  currentPlanId?: SubscriptionPlan | null;
}>;

export type PricingTierCardDetailProps = Readonly<{
  tier: PricingTierRow;
}>;

export type UsePricingSelectTier = (tierId: string) => void;

export type UsePricingPurchase = Readonly<{
  purchase: (tier: PricingTierRow) => Promise<void>;
  isPurchasing: boolean;
  error: string | null;
}>;
