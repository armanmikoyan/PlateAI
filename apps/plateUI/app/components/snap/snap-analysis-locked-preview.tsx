import { CheckCircle2 } from 'lucide-react';
import { HeroNutrientTile } from '@/app/components/hero/hero-nutrient-tile';
import { HERO } from '@/app/components/hero/constants';
import type { MealAnalysisLockedResult } from '@plate/plate-ai/types';
import { SNAP, SNAP_LOCKED_DECOY, SNAP_LOCKED_PREVIEW } from './constants';
import { SnapAnalysisUnlockButton } from './snap-analysis-unlock-button';
import { SnapLockedNutrientTile } from './snap-locked-nutrient-tile';
import { SnapLockedPlaceholder } from './snap-locked-placeholder';
import {
  snapConfidenceLabel,
  snapLockedCaloriesTile,
  snapLockedNutrientTiles,
  snapLockedProteinTile,
  snapNutrientTilesForAnalysis,
} from './utils';

export function SnapAnalysisLockedPreview({
  analysis,
}: Readonly<{ analysis: MealAnalysisLockedResult | null }>) {
  return (
    <div className="flex flex-col">
      <div className="border-edge shrink-0 border-b px-4 py-3 sm:px-5">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
          {SNAP_LOCKED_PREVIEW.CONFIDENCE_LABEL}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm">
          <CheckCircle2 className="text-positive size-4 shrink-0" aria-hidden />
          {analysis ? (
            snapConfidenceLabel(analysis.confidence)
          ) : (
            <SnapLockedPlaceholder value={SNAP_LOCKED_DECOY.CONFIDENCE} />
          )}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 py-3 pb-4 sm:px-5 sm:pb-5">
        <div>
          <p className="font-heading text-sm font-medium tracking-tight">{HERO.NUTRIENTS_SECTION_LABEL}</p>
          <p className="text-muted-foreground mt-0.5 text-xs/relaxed">{SNAP.ANALYSIS_SCOPE}</p>
        </div>

        {analysis ? (
          <div className="flex flex-col gap-1.5 md:gap-2">
            <div className="relative overflow-hidden rounded-lg">
              <div className="grid min-w-0 grid-cols-2 gap-1.5 *:min-w-0 md:gap-2 @xl/result:grid-cols-4">
                <div className="col-span-2 @xl/result:col-span-4">
                  <SnapLockedNutrientTile
                    {...snapLockedCaloriesTile()}
                    decoyValue={SNAP_LOCKED_DECOY.NUTRIENT}
                  />
                </div>
                <SnapLockedNutrientTile
                  {...snapLockedProteinTile()}
                  decoyValue={SNAP_LOCKED_DECOY.NUTRIENT}
                />
              </div>
              <div className="bg-background/40 absolute inset-0 flex items-center justify-center">
                <SnapAnalysisUnlockButton />
              </div>
            </div>
            <div className="grid min-w-0 grid-cols-2 gap-1.5 *:min-w-0 md:gap-2 @xl/result:grid-cols-4">
              {snapNutrientTilesForAnalysis(analysis).map((row) => (
                <HeroNutrientTile key={row.KEY} {...row} />
              ))}
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-lg">
            <div className="grid min-w-0 grid-cols-2 gap-1.5 *:min-w-0 md:gap-2 @xl/result:grid-cols-4">
              <div className="col-span-2 @xl/result:col-span-4">
                <SnapLockedNutrientTile
                  {...snapLockedCaloriesTile()}
                  decoyValue={SNAP_LOCKED_DECOY.NUTRIENT}
                />
              </div>
              <SnapLockedNutrientTile {...snapLockedProteinTile()} decoyValue={SNAP_LOCKED_DECOY.NUTRIENT} />
              {snapLockedNutrientTiles().map((row) => (
                <SnapLockedNutrientTile key={row.KEY} {...row} />
              ))}
            </div>
            <div className="bg-background/40 absolute inset-0 flex items-center justify-center">
              <SnapAnalysisUnlockButton />
            </div>
          </div>
        )}

        <div>
          <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
            {SNAP_LOCKED_PREVIEW.NOTES_LABEL}
          </p>
          <p className="text-muted-foreground mt-1 text-sm/relaxed">
            {analysis?.notes ? analysis.notes : <SnapLockedPlaceholder value={SNAP_LOCKED_DECOY.NOTES} />}
          </p>
        </div>
      </div>
    </div>
  );
}
