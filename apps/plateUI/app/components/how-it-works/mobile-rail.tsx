'use client';

import type { ReactNode } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';

export function MobileRail({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string | null>(null);

  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;

    const measure = () => {
      const icons = host.querySelectorAll<HTMLElement>('[data-rail-icon]');
      if (icons.length < 3) return;

      const container = host.getBoundingClientRect();
      const cW = container.width;

      const rightGutter = cW - 16;
      const leftGutter = 16;

      const coords = [...icons].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          cx: r.left + r.width / 2 - container.left,
          cy: r.top + r.height / 2 - container.top,
          right: r.right - container.left,
          left: r.left - container.left,
        };
      });

      const [a, b, c] = coords;
      const d = [
        `M ${a.right} ${a.cy}`,
        `H ${rightGutter}`,
        `V ${b.cy}`,
        `H ${b.left}`,
        `H ${leftGutter}`,
        `V ${c.cy}`,
        `H ${c.left}`,
      ].join(' ');

      setPath(d);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative">
      {path ? (
        <div className="pointer-events-none absolute inset-0 -z-10 lg:hidden" aria-hidden>
          <svg className="size-full" fill="none" strokeLinecap="round">
            <defs>
              <linearGradient id="rail-grad" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.6} />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <path d={path} stroke="url(#rail-grad)" strokeWidth={1} />
            <path
              pathLength={100}
              className="animate-rail-dash motion-reduce:animate-none"
              d={path}
              stroke="#fff"
              strokeOpacity={0.7}
              strokeWidth={0.75}
              strokeDasharray="6 94"
            />
          </svg>
        </div>
      ) : null}
      {children}
    </div>
  );
}
