'use client';

import Link from 'next/link';
import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';
import { isPaidPlan, isPlanUpgrade, isPurchasablePlan } from '@plate/plate-billing/utils';
import { cn } from '@/app/utils/cn';
import { Badge } from '@/app/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/ui/card';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { PRICING_PAGE, PRICING_SECTION } from './constants';
import { usePricingPurchase, usePricingSelectTier } from './hooks';
import { PricingTierCardDetail } from './pricing-tier-card-detail';
import { PricingTierFeatureList } from './pricing-tier-feature-list';
import type { PricingTierCardProps } from './types';
import {
  buildPricingPurchaseCtaLabel,
  buildPricingTierHref,
  buildPricingUpgradeCtaLabel,
  getPricingTierById,
} from './utils';

export function PricingTierCard({
  tier,
  variant,
  isSelected = false,
  hasActiveSelection = false,
  currentPlanId = null,
}: PricingTierCardProps) {
  const selectTier = usePricingSelectTier();
  const { purchase, isPurchasing, error } = usePricingPurchase();
  const upgradeTier = getPricingTierById(SUBSCRIPTION_PLAN.PRO);
  const detailHref = buildPricingTierHref(tier.ID);
  const isCurrentPlan = currentPlanId != null && tier.ID === currentPlanId;
  const canPurchaseUpgrade = currentPlanId == null || isPlanUpgrade(tier.ID, currentPlanId);
  const showPopularHighlight = tier.HIGHLIGHT && !isCurrentPlan && !hasActiveSelection;
  const showSelectedHighlight = isSelected && !isCurrentPlan;

  const cardClassName = cn(
    'flex w-full flex-col transition-shadow motion-reduce:transition-none',
    variant === 'preview' && 'h-full',
    variant === 'detail' &&
      showSelectedHighlight &&
      'ring-accent/50 border-accent/40 bg-surface-raised ring-2 shadow-md shadow-accent/10 md:translate-y-0',
    isCurrentPlan && 'border-positive/40 ring-positive/50 ring-1',
    variant === 'detail' &&
      !showSelectedHighlight &&
      showPopularHighlight &&
      'ring-accent/35 md:-translate-y-3 md:ring-2',
    variant === 'preview' && showPopularHighlight && 'ring-accent/35 md:-translate-y-3 md:ring-2',
    variant === 'preview' && 'group-hover:shadow-md',
    variant === 'detail' && !showSelectedHighlight && 'hover:shadow-md motion-reduce:transition-none',
  );
  const shellClassName = cn('flex flex-col', variant === 'detail' && 'flex-1');

  const cardBody = (
    <>
      <CardHeader>
        {tier.BADGE || isCurrentPlan ? (
          <CardAction>
            {tier.BADGE ? <Badge variant="secondary">{tier.BADGE}</Badge> : null}
            {isCurrentPlan ? (
              <Badge variant="outline" className="border-positive/60 text-positive">
                {PRICING_SECTION.YOUR_PLAN}
              </Badge>
            ) : null}
          </CardAction>
        ) : null}
        <CardTitle>{tier.NAME}</CardTitle>
        <CardDescription>{tier.TAGLINE}</CardDescription>
      </CardHeader>
      <CardContent className={cn(variant === 'detail' && 'flex flex-1 flex-col')}>
        <div className="flex items-baseline gap-1">
          <span className="font-heading text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
            {tier.PRICE.replace(/\.\d+$/, '')}
            {tier.PRICE.includes('.') ? (
              <span className="text-lg font-medium text-muted-foreground sm:text-xl">
                {tier.PRICE.slice(tier.PRICE.indexOf('.'))}
              </span>
            ) : null}
          </span>
          <span className="text-muted-foreground text-sm font-medium">{tier.PERIOD}</span>
        </div>
        <div className={cn(variant === 'detail' && 'flex flex-1 flex-col')}>
          <PricingTierFeatureList lines={tier.FEATURES} />
        </div>
        {variant === 'detail' && !isSelected ? (
          <p className="text-content-muted mt-4 text-center text-sm font-medium">
            {PRICING_SECTION.SHOW_DETAILS_HINT}
          </p>
        ) : null}
      </CardContent>
    </>
  );

  if (variant === 'preview') {
    return (
      <Link
        href={detailHref}
        scroll={false}
        onClick={() => {
          sessionStorage.setItem(PRICING_PAGE.SCROLL_PLAN_FLAG, '1');
        }}
        className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label={`${tier.NAME} — ${PRICING_SECTION.VIEW_DETAILS}`}
      >
        <Card className={cardClassName}>
          <div className={shellClassName}>{cardBody}</div>
          <CardFooter className="mt-auto flex-col items-stretch">
            <span
              className={cn(
                'inline-flex h-10 w-full items-center justify-center rounded-lg px-4 text-sm font-medium',
                tier.HIGHLIGHT
                  ? 'bg-primary text-primary-foreground'
                  : 'border-edge text-content border bg-transparent',
              )}
            >
              {PRICING_SECTION.VIEW_DETAILS}
            </span>
          </CardFooter>
        </Card>
      </Link>
    );
  }

  return (
    <Card className={cardClassName}>
      <button
        type="button"
        onClick={() => selectTier(tier.ID)}
        aria-expanded={isSelected}
        aria-label={`${tier.NAME} — ${PRICING_SECTION.VIEW_DETAILS}`}
        className={cn(
          'block w-full cursor-pointer text-left',
          'rounded-t-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        )}
      >
        <div data-pricing-tier-shell={true} className={shellClassName}>
          {cardBody}
        </div>
        <div
          className={cn(
            'grid px-(--card-spacing) transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none',
            isSelected ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <PricingTierCardDetail tier={tier} />
          </div>
        </div>
      </button>
      {isSelected ? (
        <div className="flex flex-col gap-3 px-(--card-spacing) pb-(--card-spacing)">
          {isCurrentPlan ? (
            <>
              <p className="text-muted-foreground text-center text-xs" role="status">
                {error ?? PRICING_SECTION.CURRENT_PLAN_NOTE}
              </p>
              {currentPlanId === SUBSCRIPTION_PLAN.BASIC ? (
                <ShimmerButton
                  type="button"
                  background={PRICING_PAGE.FIXED_CTA_SHIMMER_BACKGROUND}
                  shimmerColor={PRICING_PAGE.FIXED_CTA_SHIMMER_COLOR}
                  shimmerSize="2px"
                  disabled={isPurchasing}
                  aria-disabled={isPurchasing}
                  aria-label={buildPricingUpgradeCtaLabel(upgradeTier)}
                  className="text-button-default-fg h-11 gap-2 px-5 text-base"
                  onClick={() => {
                    purchase(upgradeTier);
                  }}
                >
                  <span aria-live="polite">
                    {isPurchasing ? 'Redirecting to checkout…' : buildPricingUpgradeCtaLabel(upgradeTier)}
                  </span>
                </ShimmerButton>
              ) : null}
            </>
          ) : isPurchasablePlan(tier.ID) && canPurchaseUpgrade ? (
            <>
              <ShimmerButton
                type="button"
                background={PRICING_PAGE.FIXED_CTA_SHIMMER_BACKGROUND}
                shimmerColor={PRICING_PAGE.FIXED_CTA_SHIMMER_COLOR}
                shimmerSize="2px"
                disabled={isPurchasing}
                aria-disabled={isPurchasing}
                aria-label={buildPricingPurchaseCtaLabel(tier)}
                className="text-button-default-fg h-11 gap-2 px-5 text-base"
                onClick={() => {
                  purchase(tier);
                }}
              >
                <span aria-live="polite">
                  {isPurchasing ? 'Redirecting to checkout…' : buildPricingPurchaseCtaLabel(tier)}
                </span>
              </ShimmerButton>
              <p className="text-muted-foreground text-center text-xs" role="status">
                {error ?? PRICING_SECTION.CHECKOUT_NOTE}
              </p>
            </>
          ) : isPurchasablePlan(tier.ID) ? (
            <p className="text-muted-foreground text-center text-xs">{PRICING_SECTION.ALREADY_INCLUDED}</p>
          ) : isPaidPlan(tier.ID) ? (
            <a
              href={PRICING_SECTION.CONTACT_US_HREF}
              className="text-button-default-fg inline-flex h-11 w-full items-center justify-center rounded-lg px-5 text-base font-medium"
              style={{ background: PRICING_PAGE.FIXED_CTA_SHIMMER_BACKGROUND }}
            >
              {PRICING_SECTION.CONTACT_US}
            </a>
          ) : (
            <p className="text-muted-foreground text-center text-xs">{PRICING_SECTION.FREE_PLAN_CTA}</p>
          )}
        </div>
      ) : null}
    </Card>
  );
}
