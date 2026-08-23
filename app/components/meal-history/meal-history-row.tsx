'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Clock3, LoaderCircle, Trash2 } from 'lucide-react';

import { MEAL_ANALYSIS_STATUS } from '@/lib/meal-analyses/constants';
import { writeSnapSavedMealCache } from '@/lib/meal-analyses/session-cache';
import { Badge } from '@/app/ui/badge';
import { Button } from '@/app/ui/button';
import { Card, CardContent } from '@/app/ui/card';

import { MEAL_HISTORY } from './constants';
import type { MealHistoryRowProps } from './types';
import {
  formatMealHistoryDate,
  mealHistoryImageLoader,
  mealHistoryImageSrc,
  mealHistoryRowHref,
  mealHistoryRowTitle,
  mealHistorySnapCachePayload,
} from './utils';

function statusLabel(status: MealHistoryRowProps['item']['status']): string {
  if (status === MEAL_ANALYSIS_STATUS.PENDING) {
    return MEAL_HISTORY.STATUS_PENDING;
  }

  if (status === MEAL_ANALYSIS_STATUS.DONE) {
    return MEAL_HISTORY.STATUS_DONE;
  }

  return MEAL_HISTORY.STATUS_FAILED;
}

function statusVariant(status: MealHistoryRowProps['item']['status']) {
  if (status === MEAL_ANALYSIS_STATUS.DONE) {
    return 'secondary' as const;
  }

  if (status === MEAL_ANALYSIS_STATUS.FAILED) {
    return 'destructive' as const;
  }

  return 'outline' as const;
}

export function MealHistoryRow({ item, onRemove, removing = false }: MealHistoryRowProps) {
  const href = mealHistoryRowHref(item);
  const actionLabel =
    item.status === MEAL_ANALYSIS_STATUS.PENDING
      ? MEAL_HISTORY.ANALYZE_PENDING
      : item.status === MEAL_ANALYSIS_STATUS.FAILED
        ? MEAL_HISTORY.RETRY
        : MEAL_HISTORY.VIEW_RESULTS;

  function handleOpenSavedMeal() {
    writeSnapSavedMealCache(mealHistorySnapCachePayload(item));
  }

  return (
    <Card className="py-0">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-edge sm:size-20">
            <Image
              src={mealHistoryImageSrc(item)}
              alt={MEAL_HISTORY.MEAL_PREVIEW_ALT}
              fill
              unoptimized
              loader={mealHistoryImageLoader}
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(item.status)}>{statusLabel(item.status)}</Badge>
              <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                <Clock3 className="size-3.5" aria-hidden />
                {MEAL_HISTORY.SAVED_AT} {formatMealHistoryDate(item.createdAt)}
              </span>
            </div>
            <p className="font-heading mt-2 truncate text-base font-semibold tracking-tight">
              {mealHistoryRowTitle(item)}
            </p>
            {item.analysis ? (
              <p className="text-muted-foreground mt-1 text-sm">
                {item.analysis.calories} kcal · {item.analysis.proteinG}g protein
              </p>
            ) : null}
            {item.errorMessage ? (
              <p className="text-destructive mt-1 text-sm">{item.errorMessage}</p>
            ) : null}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {onRemove ? (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={MEAL_HISTORY.REMOVE_PENDING_ARIA}
              disabled={removing}
              onClick={() => {
                void onRemove(item.id);
              }}
            >
              {removing ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-4" aria-hidden />
              )}
            </Button>
          ) : null}
          <Button
            className="shrink-0"
            nativeButton={false}
            render={<Link href={href} onClick={handleOpenSavedMeal} />}
            variant={item.status === MEAL_ANALYSIS_STATUS.PENDING ? 'default' : 'outline'}
          >
            {actionLabel}
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
