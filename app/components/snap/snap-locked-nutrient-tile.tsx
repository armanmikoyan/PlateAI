import { Card, CardContent } from '@/app/ui/card';
import { cn } from '@/lib/utils';

import { SNAP_LOCKED_DECOY } from './constants';
import { SnapLockedPlaceholder } from './snap-locked-placeholder';
import type { SnapLockedNutrientTileProps } from './types';

export function SnapLockedNutrientTile({
  ICON,
  LABEL,
  UNIT,
  ICON_CLASS,
  ICON_BG_CLASS,
  decoyValue = SNAP_LOCKED_DECOY.NUTRIENT,
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
            <SnapLockedPlaceholder value={decoyValue} />
            <SnapLockedPlaceholder
              value={UNIT}
              className="text-muted-foreground ml-1 font-sans text-[10px] font-normal sm:text-xs"
            />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
