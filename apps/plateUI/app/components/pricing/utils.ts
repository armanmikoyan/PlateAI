import { PRICING_PAGE, PRICING_TIERS } from './constants';
import type { PricingTierRow } from './types';

export function isPricingTierId(value: string): boolean {
  return PRICING_TIERS.some((tier) => tier.ID === value);
}

export function resolveActivePricingTierId(selectedTierId: string | null): string {
  if (selectedTierId && isPricingTierId(selectedTierId)) {
    return selectedTierId;
  }
  return PRICING_PAGE.DEFAULT_TIER_ID;
}

export function getPricingTierById(tierId: string): PricingTierRow {
  const tier = PRICING_TIERS.find((row) => row.ID === tierId);
  if (tier) {
    return tier;
  }
  return PRICING_TIERS.find((row) => row.ID === PRICING_PAGE.DEFAULT_TIER_ID)!;
}

export function buildPricingPurchaseCtaLabel(tier: PricingTierRow): string {
  return `${PRICING_PAGE.FIXED_CTA_PURCHASE} ${tier.NAME} — ${tier.PRICE}`;
}

export function buildPricingUpgradeCtaLabel(tier: PricingTierRow): string {
  return `${PRICING_PAGE.FIXED_CTA_UPGRADE} ${tier.NAME} — ${tier.PRICE}`;
}

export function buildPricingPlanCardId(tierId: string): string {
  return `pricing-plan-${tierId}`;
}

export function buildPricingTierHref(tierId: string): string {
  return `/pricing?plan=${tierId}`;
}

export function readPricingTierIdFromHash(hash: string): string | null {
  const fragments = hash.split('#').filter(Boolean);

  for (let index = fragments.length - 1; index >= 0; index -= 1) {
    const tierId = fragments[index];
    if (isPricingTierId(tierId)) {
      return tierId;
    }
  }

  return null;
}

export function readPricingTierIdFromSearch(search: string): string | null {
  const params = new URLSearchParams(search.startsWith('?') ? search : `?${search}`);
  const plan = params.get('plan');
  if (!plan || !isPricingTierId(plan)) {
    return null;
  }
  return plan;
}
