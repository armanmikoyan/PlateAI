import { cn } from '@/lib/utils';

import type { SnapLockedValueProps } from './types';

export function SnapLockedValue({ value, className }: SnapLockedValueProps) {
  return (
    <span
      className={cn(
        'inline-block max-w-full truncate blur-[5px] select-none motion-reduce:blur-none',
        className,
      )}
      aria-hidden="true"
    >
      {value}
    </span>
  );
}
