'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useSetAtom } from 'jotai';
import { scrollBehavior } from '@/app/components/nav-bar/utils';
import { PRICING_PAGE } from './constants';
import { pricingSelectedTierIdAtom } from './state';
import {
  buildPricingPlanCardId,
  buildPricingTierHref,
  readPricingTierIdFromHash,
  readPricingTierIdFromSearch,
} from './utils';

export function PricingUrlSync() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const setSelectedTierId = useSetAtom(pricingSelectedTierIdAtom);

  const planFromUrl = useMemo(
    () => readPricingTierIdFromSearch(`?${searchParams.toString()}`),
    [searchParams],
  );

  useEffect(() => {
    if (pathname !== '/pricing') {
      return;
    }

    setSelectedTierId(planFromUrl);
  }, [pathname, planFromUrl, setSelectedTierId]);

  useEffect(() => {
    if (pathname !== '/pricing') {
      return;
    }

    const legacyHashTierId = readPricingTierIdFromHash(window.location.hash);
    if (!legacyHashTierId || planFromUrl) {
      return;
    }

    router.replace(buildPricingTierHref(legacyHashTierId), { scroll: false });
  }, [pathname, planFromUrl, router]);

  useEffect(() => {
    if (pathname !== '/pricing' || !planFromUrl) {
      return;
    }

    if (sessionStorage.getItem(PRICING_PAGE.SCROLL_PLAN_FLAG) !== '1') {
      return;
    }

    sessionStorage.removeItem(PRICING_PAGE.SCROLL_PLAN_FLAG);

    const scrollToPlan = (attempt = 0) => {
      const planEl =
        document.getElementById(buildPricingPlanCardId(planFromUrl)) ??
        document.getElementById(PRICING_PAGE.PLANS_SECTION_ID);
      if (planEl) {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        planEl.scrollIntoView({ behavior: scrollBehavior(reduce), block: 'start' });
        return;
      }

      if (attempt < 12) {
        window.requestAnimationFrame(() => scrollToPlan(attempt + 1));
      }
    };

    window.requestAnimationFrame(() => scrollToPlan());
  }, [pathname, planFromUrl]);

  return null;
}
