import { Card, CardContent } from '@/app/ui/card';
import { cn } from '@/lib/utils';

import { SnapLockedValue } from './snap-locked-value';
import type { SnapLockedNutrientTileProps } from './types';

export function SnapLockedNutrientTile({
  ICON,
  LABEL,
  UNIT,
  value,
  ICON_CLASS,
  ICON_BG_CLASS,
}: SnapLockedNutrientTileProps) {
  return (
    <Card size="sm">
      <CardContent className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-md sm:size-9',
            ICON_BG_CLASS,
          )}
        >
          <ICON className={ICON_CLASS} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-muted-foreground text-[8px] font-semibold tracking-widest uppercase sm:text-[9px]">
            {LABEL}
          </p>
          <p className="font-heading text-sm font-semibold tracking-tight tabular-nums sm:text-base">
            <SnapLockedValue value={value} />
            <span className="text-muted-foreground ml-1 inline-block font-sans text-[10px] font-normal blur-[4px] sm:text-xs motion-reduce:blur-none">
              {UNIT}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
