import { createHmac, timingSafeEqual } from 'node:crypto';
import { LEMON_SQUEEZY_SUBSCRIPTION_STATUS } from '@/routes/checkout/constants.js';
import type { LemonSqueezySubscriptionStatus } from '@/routes/checkout/types.js';
import type { LemonSqueezyWebhookPayload, LemonSqueezyVariantPlanMap } from '@/routes/checkout/types.js';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/routes/meal-analyses/constants.js';
import type { SubscriptionPlan, SubscriptionStatus } from '@/routes/meal-analyses/constants.js';

export function verifyWebhookSignature(secret: string, signatureHeader: string | undefined, rawBody: Buffer): boolean {
  if (!signatureHeader) {
    return false;
  }

  const expected = Buffer.from(createHmac('sha256', secret).update(rawBody).digest('hex'), 'utf8');
  const received = Buffer.from(signatureHeader, 'utf8');

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export function buildVariantPlanMap(plusVariantId: string, proVariantId: string): LemonSqueezyVariantPlanMap {
  return {
    [plusVariantId]: SUBSCRIPTION_PLAN.PLUS,
    [proVariantId]: SUBSCRIPTION_PLAN.PRO,
  };
}

export function isWebhookPayload(value: unknown): value is LemonSqueezyWebhookPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Record<string, unknown>;

  if (!payload.meta || typeof payload.meta !== 'object') {
    return false;
  }

  const meta = payload.meta as Record<string, unknown>;

  if (typeof meta.event_name !== 'string' || !meta.custom_data || typeof meta.custom_data !== 'object') {
    return false;
  }

  if (typeof (meta.custom_data as { user_id?: unknown }).user_id !== 'string') {
    return false;
  }

  if (!payload.data || typeof payload.data !== 'object') {
    return false;
  }

  const data = payload.data as Record<string, unknown>;

  if (typeof data.id !== 'string') {
    return false;
  }

  if (!data.attributes || typeof data.attributes !== 'object') {
    return false;
  }

  if (typeof (data.attributes as { test_mode?: unknown }).test_mode !== 'boolean') {
    return false;
  }

  return true;
}

export function readLemonUserId(payload: LemonSqueezyWebhookPayload): string | null {
  return payload.meta.custom_data?.user_id ?? null;
}

export function readSubscriptionDates(payload: LemonSqueezyWebhookPayload): Readonly<{
  subscriptionRenewsAt?: string;
  subscriptionEndsAt?: string;
}> {
  const renewsAt = payload.data.attributes.renews_at ?? null;
  const endsAt = payload.data.attributes.ends_at ?? null;

  return {
    ...(renewsAt ? { subscriptionRenewsAt: renewsAt } : {}),
    ...(endsAt ? { subscriptionEndsAt: endsAt } : {}),
  };
}

export function toSubscriptionStatus(status: LemonSqueezySubscriptionStatus | null): SubscriptionStatus | null {
  switch (status) {
    case LEMON_SQUEEZY_SUBSCRIPTION_STATUS.ACTIVE:
      return SUBSCRIPTION_STATUS.ACTIVE;
    case LEMON_SQUEEZY_SUBSCRIPTION_STATUS.CANCELLED:
      return SUBSCRIPTION_STATUS.CANCELLED;
    case LEMON_SQUEEZY_SUBSCRIPTION_STATUS.EXPIRED:
      return SUBSCRIPTION_STATUS.EXPIRED;
    default:
      return null;
  }
}

export function isPurchasablePlan(plan: string): plan is SubscriptionPlan {
  return plan === SUBSCRIPTION_PLAN.PLUS || plan === SUBSCRIPTION_PLAN.PRO;
}

export function resolvePlanFromVariantId(
  variantId: number,
  variantPlanMap: Readonly<Record<string, SubscriptionPlan>>,
): SubscriptionPlan | null {
  const plan = variantPlanMap[String(variantId)];

  return plan && (plan === SUBSCRIPTION_PLAN.PLUS || plan === SUBSCRIPTION_PLAN.PRO) ? plan : null;
}
