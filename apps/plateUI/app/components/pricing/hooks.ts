'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useLayoutEffect, type RefObject } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { buildPricingTierHref, isPricingTierId, resolveActivePricingTierId } from './utils';
import { pricingSelectedTierIdAtom } from './state';
import type { UsePricingSelectTier } from './types';

const PRICING_TIER_SHELL_SELECTOR = '[data-pricing-tier-shell]';
const PRICING_TIER_SHELL_MIN_HEIGHT_VAR = '--pricing-tier-shell-min-h';

export function usePricingSelectedTierId(): string | null {
  return useAtomValue(pricingSelectedTierIdAtom);
}

export function usePricingActiveTierId(): string {
  const selectedTierId = usePricingSelectedTierId();
  return resolveActivePricingTierId(selectedTierId);
}

export function usePricingSelectTier(): UsePricingSelectTier {
  const pathname = usePathname();
  const router = useRouter();
  const setSelectedTierId = useSetAtom(pricingSelectedTierIdAtom);

  return useCallback(
    (tierId: string) => {
      if (pathname !== '/pricing' || !isPricingTierId(tierId)) {
        return;
      }

      setSelectedTierId(tierId);
      router.replace(buildPricingTierHref(tierId), { scroll: false });
    },
    [pathname, router, setSelectedTierId],
  );
}

export function usePricingTierShellMinHeight(
  gridRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): void {
  const activeTierId = usePricingActiveTierId();

  useLayoutEffect(() => {
    if (!enabled || !gridRef.current) {
      return;
    }

    const grid = gridRef.current;

    const measure = () => {
      const shells = grid.querySelectorAll<HTMLElement>(PRICING_TIER_SHELL_SELECTOR);
      let max = 0;

      shells.forEach((shell) => {
        shell.style.minHeight = '';
        max = Math.max(max, shell.getBoundingClientRect().height);
      });

      shells.forEach((shell) => {
        shell.style.minHeight = max > 0 ? `${max}px` : '';
      });

      if (max > 0) {
        grid.style.setProperty(PRICING_TIER_SHELL_MIN_HEIGHT_VAR, `${max}px`);
      } else {
        grid.style.removeProperty(PRICING_TIER_SHELL_MIN_HEIGHT_VAR);
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(grid);
    grid.querySelectorAll(PRICING_TIER_SHELL_SELECTOR).forEach((shell) => {
      resizeObserver.observe(shell);
    });

    return () => {
      resizeObserver.disconnect();
      grid.style.removeProperty(PRICING_TIER_SHELL_MIN_HEIGHT_VAR);
    };
  }, [activeTierId, enabled, gridRef]);
}
