'use client';

import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '@/app/utils/cn';

type NumberTickerProps = ComponentPropsWithoutRef<'span'> &
  Readonly<{
    value: number;
    startValue?: number;
    delay?: number;
    decimalPlaces?: number;
  }>;

export function NumberTicker({
  value,
  startValue,
  delay = 0,
  className,
  decimalPlaces = 0,
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const from = startValue ?? 0;
  const motionValue = useMotionValue(from);
  const springValue = useSpring(motionValue, {
    damping: 38,
    stiffness: 90,
  });

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    const timer = window.setTimeout(() => {
      motionValue.set(value);
    }, delay * 1000);

    return () => window.clearTimeout(timer);
  }, [delay, motionValue, reduceMotion, value]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          }).format(Number(latest.toFixed(decimalPlaces)));
        }
      }),
    [decimalPlaces, springValue],
  );

  const formatted = Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(reduceMotion ? value : from);

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)} {...props}>
      {formatted}
    </span>
  );
}
