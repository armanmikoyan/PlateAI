import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

import { HeroNutrientTile } from '@/app/components/hero/hero-nutrient-tile';
import { HERO } from '@/app/components/hero/constants';
import { Badge } from '@/app/ui/badge';

import { SNAP, SNAP_LOCKED_PREVIEW } from './constants';
import type { SnapAnalysisUnlockedReadoutProps } from './types';
import {
  snapCaloriesTileForAnalysis,
  snapConfidenceLabel,
  snapMacroTilesForAnalysis,
} from './utils';

export function SnapAnalysisUnlockedReadout({
  analysis,
  previewUrl,
}: SnapAnalysisUnlockedReadoutProps) {
  const caloriesTile = snapCaloriesTileForAnalysis(analysis);
  const nutrientTiles = snapMacroTilesForAnalysis(analysis);

  return (
    <div className="flex flex-col">
      <div className="border-edge shrink-0 border-b px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="relative size-14 shrink-0 overflow-hidden rounded-lg sm:size-16">
            <Image
              src={previewUrl}
              alt={SNAP.PREVIEW_ALT}
              fill
              unoptimized
              sizes="64px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <Badge variant="ghost">{SNAP.ANALYSIS_DETECTED}</Badge>
            <p className="font-heading mt-1.5 text-base font-semibold tracking-tight sm:text-lg">
              {analysis.mealName}
            </p>
          </div>
        </div>
      </div>

      <div className="border-edge shrink-0 border-b px-4 py-3 sm:px-5">
        <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
          {SNAP_LOCKED_PREVIEW.CONFIDENCE_LABEL}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-sm">
          <CheckCircle2 className="text-positive size-4 shrink-0" aria-hidden />
          {snapConfidenceLabel(analysis.confidence)}
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 py-3 pb-4 sm:px-5 sm:pb-5">
        <div>
          <p className="font-heading text-sm font-medium tracking-tight">
            {HERO.NUTRIENTS_SECTION_LABEL}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs/relaxed">{SNAP.ANALYSIS_SCOPE}</p>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-1.5 *:min-w-0 md:gap-2 @xl/result:grid-cols-4">
          <div className="col-span-2 @xl/result:col-span-4">
            <HeroNutrientTile {...caloriesTile} />
          </div>
          {nutrientTiles.map((row) => (
            <HeroNutrientTile key={row.KEY} {...row} />
          ))}
        </div>

        {analysis.notes ? (
          <div>
            <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
              {SNAP_LOCKED_PREVIEW.NOTES_LABEL}
            </p>
            <p className="text-muted-foreground mt-1 text-sm/relaxed">{analysis.notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
