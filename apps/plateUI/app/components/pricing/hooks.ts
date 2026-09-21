'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useLayoutEffect, useState, type RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { resolveActivePricingTierId, buildPricingTierHref } from './utils';
import { PRICING_SECTION } from './constants';
import { pricingSelectedTierIdAtom } from './state';
import type { PricingTierRow, UsePricingSelectTier, UsePricingPurchase } from './types';
import { trackCheckoutStart } from '@/app/utils/analytics';

const PRICING_TIER_SHELL_SELECTOR = '[data-pricing-tier-shell]';
const PRICING_TIER_CARD_SELECTOR = '[data-pricing-tier-card]';
const PRICING_TIER_REGION_SELECTOR = '[data-pricing-tier-region]';

export function usePricingSelectedTierId(): string | null {
  return useAtomValue(pricingSelectedTierIdAtom);
}

export function usePricingActiveTierId(): string {
  const selectedTierId = usePricingSelectedTierId();
  return resolveActivePricingTierId(selectedTierId);
}

export function usePricingSelectTier(): UsePricingSelectTier {
  const setSelectedTierId = useSetAtom(pricingSelectedTierIdAtom);

  return useCallback(
    (tierId: string) => {
      setSelectedTierId(tierId);
    },
    [setSelectedTierId],
  );
}

export function usePricingPurchase(): UsePricingPurchase {
  const router = useRouter();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const purchase = useCallback(
    async (tier: PricingTierRow) => {
      setError(null);
      setIsPurchasing(true);

      try {
        trackCheckoutStart(tier.ID);
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ plan: tier.ID }),
        });

        if (response.status === 401) {
          router.push(`/login?next=${encodeURIComponent(buildPricingTierHref(tier.ID))}`);
          return;
        }

        if (!response.ok) {
          setError(PRICING_SECTION.CHECKOUT_ERROR);
          return;
        }

        const data = (await response.json()) as { url: string };
        window.open(data.url, '_blank', 'noopener,noreferrer');
      } catch {
        setError(PRICING_SECTION.CHECKOUT_ERROR);
      } finally {
        setIsPurchasing(false);
      }
    },
    [router],
  );

  return { purchase, isPurchasing, error };
}

export function usePricingTierShellMinHeight(gridRef: RefObject<HTMLElement | null>, enabled: boolean): void {
  useLayoutEffect(() => {
    if (!enabled || !gridRef.current) {
      return;
    }

    const grid = gridRef.current;
    let disposed = false;
    let lastWidth = grid.getBoundingClientRect().width;

    const getCards = () =>
      Array.from(grid.children).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement && child.matches(PRICING_TIER_CARD_SELECTOR),
      );

    const equalizeShells = () => {
      const shells = grid.querySelectorAll<HTMLElement>(PRICING_TIER_SHELL_SELECTOR);
      let shellMax = 0;

      shells.forEach((shell) => {
        shell.style.minHeight = '';
        shellMax = Math.max(shellMax, shell.getBoundingClientRect().height);
      });

      shells.forEach((shell) => {
        shell.style.minHeight = shellMax > 0 ? `${shellMax}px` : '';
      });
    };

    const lockCardHeight = () => {
      const cards = getCards();
      let cardMax = 0;

      cards.forEach((li) => {
        const region = li.querySelector<HTMLElement>(PRICING_TIER_REGION_SELECTOR);
        if (!region) {
          return;
        }
        const cardHeight = li.getBoundingClientRect().height;
        const regionHeight = region.getBoundingClientRect().height;
        cardMax = Math.max(cardMax, cardHeight - regionHeight + region.scrollHeight);
      });

      if (cardMax > 0) {
        cards.forEach((li) => {
          li.style.minHeight = `${cardMax}px`;
        });
      }
    };

    equalizeShells();
    lockCardHeight();

    const measureOnWidthChange = () => {
      const width = grid.getBoundingClientRect().width;
      if (width === lastWidth) {
        return;
      }
      lastWidth = width;
      equalizeShells();
      lockCardHeight();
    };

    const resizeObserver = new ResizeObserver(measureOnWidthChange);
    resizeObserver.observe(grid);
    grid.querySelectorAll(PRICING_TIER_SHELL_SELECTOR).forEach((shell) => {
      resizeObserver.observe(shell);
    });

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) {
          equalizeShells();
          lockCardHeight();
        }
      });
    }

    return () => {
      disposed = true;
      resizeObserver.disconnect();
    };
  }, [enabled, gridRef]);
}
