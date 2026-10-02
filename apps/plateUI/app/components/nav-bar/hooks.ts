'use client';

import { useEffect, useRef, useState } from 'react';
import { useSetAtom } from 'jotai';
import { useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { fetchMealHistory, pendingMealCount } from '@/app/components/meal-history/utils';
import { MEAL_ANALYSES_CHANGED_EVENT } from '@/app/utils/meal-analyses/constants';
import type { AuthMeResponse } from '@/app/api/auth/types';
import { NAV_BAR_CONDENSE_AFTER_PX } from './constants';
import { navAuthPendingCountAtom, navAuthReadyAtom, navAuthUserAtom } from './state';
import type { NavAuthSession } from './types';

/**
 * `true` once the page has scrolled past `NAV_BAR_CONDENSE_AFTER_PX` — drives the
 * bar's rest/condensed presentation. Geometry is animated with a spring from
 * `NAV_MOTION_SPRING`, so the flag only needs to flip on transitions: the ref guard
 * keeps this a no-op on every other scroll frame.
 */
export function useNavBarCondensed(): boolean {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const condensedRef = useRef(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const next = latest > NAV_BAR_CONDENSE_AFTER_PX;
    if (next === condensedRef.current) return;
    condensedRef.current = next;
    setCondensed(next);
  });

  return condensed;
}

/**
 * Scroll progress as a percentage `width`, not `scaleX`: scaling squashes the fill's
 * rounded cap into an ellipse and compresses its gradient so the leading tip changes
 * colour as you scroll. Animating `width` keeps the cap a true semicircle, and since
 * the fill is absolutely positioned the change never reflows the nav content.
 */
export function useNavBarProgressWidth() {
  const { scrollYProgress } = useScroll();

  return useTransform(scrollYProgress, (value) => `${value * 100}%`);
}

/** Shared so mounting `NavBarAuth` twice (top bar + drawer) never doubles the request. */
let sessionRequest: Promise<NavAuthSession> | null = null;

function requestSession(): Promise<NavAuthSession> {
  sessionRequest ??= (async () => {
    let response = await fetch('/api/auth/me', { cache: 'no-store' });

    if (response.status === 401) {
      await fetch('/api/auth/refresh', { cache: 'no-store' });
      response = await fetch('/api/auth/me', { cache: 'no-store' });
    }

    if (!response.ok) {
      return { PENDING_COUNT: 0, USER: null };
    }

    const payload = (await response.json()) as AuthMeResponse;
    const history = await fetchMealHistory();

    return {
      PENDING_COUNT: history ? pendingMealCount(history.items) : 0,
      USER: payload.user,
    };
  })();

  return sessionRequest;
}

/**
 * Loads the session into `state.ts` for the whole navbar. Called once from `Navbar`,
 * which stays mounted in both breakpoints — so the drawer slot renders instantly
 * instead of re-fetching each time the sheet opens.
 */
export function useNavAuthSession(): void {
  const setUser = useSetAtom(navAuthUserAtom);
  const setPendingCount = useSetAtom(navAuthPendingCountAtom);
  const setReady = useSetAtom(navAuthReadyAtom);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const session = await requestSession();
        if (cancelled) return;
        setUser(session.USER);
        setPendingCount(session.PENDING_COUNT);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    loadSession();

    function handleMealAnalysesChanged() {
      fetchMealHistory().then((history) => {
        if (cancelled) return;
        setPendingCount(history ? pendingMealCount(history.items) : 0);
      });
    }

    window.addEventListener(MEAL_ANALYSES_CHANGED_EVENT, handleMealAnalysesChanged);

    return () => {
      cancelled = true;
      window.removeEventListener(MEAL_ANALYSES_CHANGED_EVENT, handleMealAnalysesChanged);
    };
  }, [setPendingCount, setReady, setUser]);
}
