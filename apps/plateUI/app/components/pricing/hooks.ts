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

const MD_VIEWPORT_QUERY = '(min-width: 48rem)';

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
    const mq = window.matchMedia(MD_VIEWPORT_QUERY);
    let disposed = false;

    const clearLocks = () => {
      grid.querySelectorAll<HTMLElement>(PRICING_TIER_CARD_SELECTOR).forEach((card) => {
        card.style.minHeight = '';
      });
      grid.querySelectorAll<HTMLElement>(PRICING_TIER_SHELL_SELECTOR).forEach((shell) => {
        shell.style.minHeight = '';
      });
    };

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
      const cards = Array.from(grid.children).filter(
        (child): child is HTMLElement =>
          child instanceof HTMLElement && child.matches(PRICING_TIER_CARD_SELECTOR),
      );
      let cardMax = 0;

      cards.forEach((card) => {
        cardMax = Math.max(cardMax, card.getBoundingClientRect().height);
      });

      if (cardMax > 0) {
        cards.forEach((card) => {
          card.style.minHeight = `${cardMax}px`;
        });
      }
    };

    const applyLocks = () => {
      if (!mq.matches) {
        clearLocks();
        return;
      }

      equalizeShells();
      lockCardHeight();
    };

    applyLocks();

    const resizeObserver = new ResizeObserver(applyLocks);
    resizeObserver.observe(grid);
    grid.querySelectorAll(PRICING_TIER_SHELL_SELECTOR).forEach((shell) => {
      resizeObserver.observe(shell);
    });
    grid.querySelectorAll(PRICING_TIER_REGION_SELECTOR).forEach((region) => {
      resizeObserver.observe(region);
    });

    const onMqChange = () => {
      applyLocks();
    };
    mq.addEventListener('change', onMqChange);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) {
          applyLocks();
        }
      });
    }

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      mq.removeEventListener('change', onMqChange);
    };
  }, [enabled, gridRef]);
}
