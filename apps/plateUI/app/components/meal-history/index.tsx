'use client';

import Link from 'next/link';
import { LoaderCircle } from 'lucide-react';
import { isPaidPlan, SUBSCRIPTION_STATUS } from '@plate/plate-billing';
import { Badge } from '@/app/ui/badge';
import { Button } from '@/app/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/app/ui/empty';
import { MEAL_HISTORY, MEAL_HISTORY_PLAN_LABELS, MEAL_HISTORY_STATUS_LABELS } from './constants';
import { useMealHistory } from './hooks';
import { MealHistoryRow } from './meal-history-row';
import type { MealHistoryProps } from './types';
import { formatPlanDate, isPendingMealHistoryItem } from './utils';

export default function MealHistory({ user, justPurchased = false }: MealHistoryProps) {
  const { items, loading, error, removingMealId, removeMeal } = useMealHistory(justPurchased);

  const planLabel =
    user?.subscriptionPlan != null
      ? MEAL_HISTORY_PLAN_LABELS[user.subscriptionPlan]
      : MEAL_HISTORY_PLAN_LABELS.basic;
  const statusLabel =
    user?.subscriptionStatus != null ? MEAL_HISTORY_STATUS_LABELS[user.subscriptionStatus] : null;
  const paid = user?.subscriptionPlan != null && isPaidPlan(user.subscriptionPlan);
  const planDate = paid
    ? user.subscriptionStatus === SUBSCRIPTION_STATUS.CANCELLED
      ? user.subscriptionEndsAt
      : user.subscriptionRenewsAt
    : null;
  const planDateLabel =
    user?.subscriptionStatus === SUBSCRIPTION_STATUS.CANCELLED
      ? MEAL_HISTORY.PLAN_ACCESS_UNTIL
      : MEAL_HISTORY.PLAN_RENEWS_ON;

  const planSummary = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge/60 bg-muted/30 px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">{MEAL_HISTORY.PLAN_LABEL}</span>
        <span className="font-heading text-lg font-semibold tracking-tight">{planLabel}</span>
        {statusLabel ? <Badge variant="secondary">{statusLabel}</Badge> : null}
      </div>
      {paid ? (
        planDate ? (
          <span className="text-muted-foreground text-sm">
            {planDateLabel} {formatPlanDate(planDate)}
          </span>
        ) : null
      ) : (
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href={MEAL_HISTORY.PLAN_CTA_HREF} />}
        >
          {MEAL_HISTORY.PLAN_CTA}
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <>
        {planSummary}
        <div className="flex flex-1 items-center justify-center py-16">
          <LoaderCircle className="text-muted-foreground size-8 animate-spin" aria-hidden />
        </div>
      </>
    );
  }

  if (error && items.length === 0) {
    return (
      <>
        {planSummary}
        <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-destructive">
          {error}
        </div>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        {planSummary}
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
      </>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {planSummary}
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
