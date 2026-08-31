'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/app/utils/cn';
import { MARKETING_SCROLL_ENTER_IN, MARKETING_SCROLL_MOTION_REDUCE } from './constants';

export type ScrollEnterRow = Readonly<{
  /** Stable key for list reconciliation (defaults to index). */
  KEY?: string;
  content: ReactNode;
  /** Extra classes when visible (e.g. `motion-safe:delay-150`). */
  delayClass?: string;
}>;

type ScrollEnterProps = Readonly<{
  /** Width / padding on the observed root (one `IntersectionObserver` for all rows). */
  className?: string;
  /** One or more blocks revealed together; optional stagger per row. */
  rows: readonly ScrollEnterRow[];
}>;

export function ScrollEnter({ className, rows }: ScrollEnterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      queueMicrotask(() => {
        setVisible(true);
      });
      return;
    }

    const el = rootRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {rows.map((row, i) => (
        <div
          key={row.KEY ?? i}
          className={cn(
            visible && cn(MARKETING_SCROLL_ENTER_IN, row.delayClass, MARKETING_SCROLL_MOTION_REDUCE),
            !visible && 'motion-safe:translate-y-6 motion-safe:opacity-0',
          )}
        >
          {row.content}
        </div>
      ))}
    </div>
  );
}
