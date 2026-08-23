import { CheckCircle2 } from 'lucide-react';

import { HERO } from '@/app/components/hero/constants';

import { SNAP, SNAP_LOCKED_PREVIEW } from './constants';
import { SnapAnalysisPaywall } from './snap-analysis-paywall';
import { SnapLockedNutrientTile } from './snap-locked-nutrient-tile';
import { SnapLockedValue } from './snap-locked-value';
import { snapLockedCaloriesTile, snapLockedNutrientTiles } from './utils';

export function SnapAnalysisLockedPreview() {
  const caloriesTile = snapLockedCaloriesTile();
  const nutrientTiles = snapLockedNutrientTiles();

  return (
    <div className="flex flex-col">
      <div className="border-edge shrink-0 border-b px-4 py-3 sm:px-5">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
          {SNAP_LOCKED_PREVIEW.CONFIDENCE_LABEL}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm">
          <CheckCircle2 className="text-positive size-4 shrink-0" aria-hidden />
          <SnapLockedValue value={SNAP_LOCKED_PREVIEW.CONFIDENCE_VALUE} />
        </p>
      </div>

      <SnapAnalysisPaywall>
        <div className="flex flex-col gap-3 px-4 py-3 pb-4 sm:px-5 sm:pb-5">
          <div>
            <p className="font-heading text-sm font-medium tracking-tight">
              {HERO.NUTRIENTS_SECTION_LABEL}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs/relaxed">{SNAP.ANALYSIS_SCOPE}</p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-1.5 *:min-w-0 md:gap-2 @xl/result:grid-cols-4">
            <div className="col-span-2 @xl/result:col-span-4">
              <SnapLockedNutrientTile {...caloriesTile} value={caloriesTile.VALUE} />
            </div>
            {nutrientTiles.map((row) => (
              <SnapLockedNutrientTile key={row.KEY} {...row} value={row.VALUE} />
            ))}
          </div>

          <div>
            <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
              {SNAP_LOCKED_PREVIEW.NOTES_LABEL}
            </p>
            <p className="text-muted-foreground mt-1 text-sm/relaxed">
              <SnapLockedValue value={SNAP_LOCKED_PREVIEW.NOTES_VALUE} />
            </p>
          </div>
        </div>
      </SnapAnalysisPaywall>
    </div>
  );
}
