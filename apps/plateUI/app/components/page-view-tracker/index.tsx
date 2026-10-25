'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';
import { trackPageView } from '@/app/utils/analytics';

function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPath = useRef<string | null>(null);
  const isInitialRoute = useRef(true);

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    if (isInitialRoute.current) {
      isInitialRoute.current = false;
      lastTrackedPath.current = path;
      return;
    }

    if (lastTrackedPath.current === path) {
      return;
    }

    lastTrackedPath.current = path;

    const frame = window.requestAnimationFrame(() => {
      trackPageView({
        path,
        location: window.location.href,
        title: document.title,
        referrer: document.referrer,
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, searchParams]);

  return null;
}

export default function PageViewTracker() {
  return (
    <Suspense fallback={null}>
      <RouteChangeTracker />
    </Suspense>
  );
}
