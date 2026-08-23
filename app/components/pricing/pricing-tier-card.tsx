'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
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

import { PRICING_PAGE, PRICING_SECTION } from './constants';
import { usePricingSelectTier } from './hooks';
import { PricingTierCardDetail } from './pricing-tier-card-detail';
import { PricingTierFeatureList } from './pricing-tier-feature-list';
import type { PricingTierCardProps } from './types';
import { buildPricingTierHref } from './utils';

export function PricingTierCard({
  tier,
  variant,
  isSelected = false,
  hasActiveSelection = false,
}: PricingTierCardProps) {
  const selectTier = usePricingSelectTier();
  const detailHref = buildPricingTierHref(tier.ID);
  const showPopularHighlight =
    variant === 'preview' ? tier.HIGHLIGHT : tier.HIGHLIGHT && !hasActiveSelection;
  const showSelectedHighlight = isSelected;

  const card = (
    <Card
      className={cn(
        'flex w-full flex-col transition-shadow motion-reduce:transition-none',
        variant === 'preview' && 'h-full',
        variant === 'detail' &&
          showSelectedHighlight &&
          'ring-accent/50 border-accent/40 bg-surface-raised ring-2 shadow-md shadow-accent/10 md:translate-y-0',
        variant === 'detail' &&
          !showSelectedHighlight &&
          showPopularHighlight &&
          'ring-accent/35 md:-translate-y-3 md:ring-2',
        variant === 'preview' &&
          showPopularHighlight &&
          'ring-accent/35 md:-translate-y-3 md:ring-2',
        variant === 'preview' && 'group-hover:shadow-md',
      )}
    >
      <div
        data-pricing-tier-shell={variant === 'detail' ? true : undefined}
        className={cn('flex flex-col', variant === 'detail' && 'flex-1')}
      >
        <CardHeader>
          {tier.BADGE ? (
            <CardAction>
              <Badge variant="secondary">{tier.BADGE}</Badge>
            </CardAction>
          ) : null}
          <CardTitle>{tier.NAME}</CardTitle>
          <CardDescription>{tier.TAGLINE}</CardDescription>
        </CardHeader>
        <CardContent className={cn(variant === 'detail' && 'flex flex-1 flex-col')}>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
              {tier.PRICE}
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
      </div>
      {variant === 'detail' ? (
        <>
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
          {isSelected ? (
            <p className="text-muted-foreground px-(--card-spacing) pb-(--card-spacing) text-center text-xs">
              {PRICING_SECTION.CHECKOUT_NOTE}
            </p>
          ) : null}
        </>
      ) : null}
      {variant === 'preview' ? (
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
      ) : null}
    </Card>
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
        {card}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => selectTier(tier.ID)}
      aria-expanded={isSelected}
      aria-label={`${tier.NAME} — ${PRICING_SECTION.VIEW_DETAILS}`}
      className={cn(
        'block w-full cursor-pointer rounded-xl text-left',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
        !isSelected && 'hover:shadow-md motion-reduce:transition-none',
      )}
    >
      {card}
    </button>
  );
}
