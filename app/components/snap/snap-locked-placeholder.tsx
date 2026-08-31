import { cn } from '@/app/utils/cn';

import type { SnapLockedPlaceholderProps } from './types';

export function SnapLockedPlaceholder({ value, className }: SnapLockedPlaceholderProps) {
  return (
    <span
      className={cn(
        'inline-block max-w-full truncate blur-[5px] select-none motion-reduce:blur-none',
        className,
      )}
      aria-hidden
    >
      {value}
    </span>
  );
}
