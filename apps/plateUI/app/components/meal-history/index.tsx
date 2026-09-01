'use client';

import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';

import { Button } from '@/app/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/app/ui/empty';

import { MEAL_HISTORY } from './constants';
import { useMealHistory } from './hooks';
import { MealHistoryRow } from './meal-history-row';
import { isPendingMealHistoryItem } from './utils';

export default function MealHistory() {
  const { items, loading, error, removingMealId, removeMeal } = useMealHistory();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        <LoaderCircle className="text-muted-foreground size-8 animate-spin" aria-hidden />
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Empty className="flex-1 border border-dashed py-16">
        <EmptyHeader>
          <EmptyTitle>{MEAL_HISTORY.EMPTY_TITLE}</EmptyTitle>
          <EmptyDescription>{MEAL_HISTORY.EMPTY_BODY}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href={MEAL_HISTORY.EMPTY_CTA_HREF} />}>
            {MEAL_HISTORY.EMPTY_CTA}
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? (
        <p className="text-destructive text-center text-sm" role="alert">
          {error}
        </p>
      ) : null}
      {items.map((item) => (
        <MealHistoryRow
          key={item.id}
          item={item}
          onRemove={isPendingMealHistoryItem(item) ? removeMeal : undefined}
          removing={removingMealId === item.id}
        />
      ))}
    </div>
  );
}
