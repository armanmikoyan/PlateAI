'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LoaderCircle, ExternalLink } from 'lucide-react';
import { isPaidPlan, getDailyAnalysisLimit } from '@plate/plate-billing/utils';
import { SUBSCRIPTION_STATUS } from '@plate/plate-billing/constants';
import { Badge } from '@/app/ui/badge';
import { Button } from '@/app/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from '@/app/ui/empty';
import { MEAL_HISTORY, MEAL_HISTORY_PLAN_LABELS, MEAL_HISTORY_STATUS_LABELS } from './constants';
import { useMealHistory } from './hooks';
import { MealHistoryRow } from './meal-history-row';
import type { MealHistoryProps } from './types';
import { analysesCountToday, formatPlanDate } from './utils';

export default function MealHistory({ user, justPurchased = false }: MealHistoryProps) {
  const { items, loading, error, refresh } = useMealHistory(justPurchased);
  const [portalLoading, setPortalLoading] = useState(false);

  const planLabel =
    user?.subscriptionPlan != null ? MEAL_HISTORY_PLAN_LABELS[user.subscriptionPlan] : MEAL_HISTORY.PLAN_NONE;
  const paid = user?.subscriptionPlan != null && isPaidPlan(user.subscriptionPlan);
  const isActive = paid && user.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE;
  const isCancelled = user?.subscriptionStatus === SUBSCRIPTION_STATUS.CANCELLED;
  const isExpired =
    user?.subscriptionStatus === SUBSCRIPTION_STATUS.EXPIRED ||
    (isCancelled && user.subscriptionEndsAt != null && new Date(user.subscriptionEndsAt).getTime() <= Date.now());

  const statusLabel = isExpired
    ? MEAL_HISTORY_STATUS_LABELS[SUBSCRIPTION_STATUS.EXPIRED]
    : user?.subscriptionStatus != null
      ? MEAL_HISTORY_STATUS_LABELS[user.subscriptionStatus]
      : null;

  let planDate: string | null = null;
  let planDateLabel: string = MEAL_HISTORY.PLAN_RENEWS_ON;

  if (paid) {
    if (isExpired) {
      planDate = null;
    } else if (isCancelled) {
      planDate = user.subscriptionEndsAt;
      planDateLabel = MEAL_HISTORY.PLAN_ACCESS_UNTIL;
    } else {
      planDate = user.subscriptionRenewsAt;
      planDateLabel = MEAL_HISTORY.PLAN_RENEWS_ON;
    }
  }

  const dailyLimit = paid && !isExpired ? getDailyAnalysisLimit(user.subscriptionPlan) : 0;
  const usedToday = analysesCountToday(items);
  const dailyLimitReached = paid && !isExpired && usedToday >= dailyLimit;

  async function handleDeleteItem(analysisId: string) {
    await fetch(`/api/meal-analyses/${encodeURIComponent(analysisId)}`, { method: 'DELETE' });
    await refresh();
  }

  async function handleManageSubscription() {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/checkout/portal');
      const data = (await response.json()) as { url?: string; error?: string };
      if (data.url) {
        window.open(data.url, '_blank', 'noopener');
      }
    } finally {
      setPortalLoading(false);
    }
  }

  const planSummary = (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-edge/60 bg-muted/30 px-4 py-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm font-medium">{MEAL_HISTORY.PLAN_LABEL}</span>
          <span className="font-heading text-lg font-semibold tracking-tight">{planLabel}</span>
          {statusLabel ? <Badge variant="secondary">{statusLabel}</Badge> : null}
        </div>
        {paid && dailyLimitReached ? (
          <p className="text-warning text-sm">{MEAL_HISTORY.DAILY_USAGE_FULL}</p>
        ) : null}
        {isExpired ? (
          <p className="text-muted-foreground text-sm">Your subscription has expired.</p>
        ) : null}
      </div>
      {isExpired ? (
        <Button
          nativeButton={false}
          variant="outline"
          size="sm"
          render={<Link href={MEAL_HISTORY.PLAN_CTA_HREF} />}
        >
          {MEAL_HISTORY.RESUBSCRIBE}
        </Button>
      ) : paid ? (
        <div className="flex flex-col items-end gap-1">
          {planDate ? (
            <span className="text-muted-foreground text-sm">
              {planDateLabel} {formatPlanDate(planDate)}
            </span>
          ) : null}
          {dailyLimit > 0 ? (
            <span className="text-sm">
              <span className="text-muted-foreground">{MEAL_HISTORY.DAILY_USAGE_LABEL}: </span>
              <span className="font-semibold">{usedToday} / {dailyLimit}</span>
            </span>
          ) : null}
          {isActive || isCancelled ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManageSubscription}
              disabled={portalLoading}
            >
              {portalLoading ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <ExternalLink className="size-4" />
              )}
              {MEAL_HISTORY.MANAGE_SUBSCRIPTION}
            </Button>
          ) : null}
        </div>
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
        <MealHistoryRow key={item.id} item={item} onDelete={handleDeleteItem} />
      ))}
    </div>
  );
}
