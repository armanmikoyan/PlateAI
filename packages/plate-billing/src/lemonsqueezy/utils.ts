import { createHmac, timingSafeEqual } from 'node:crypto';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/constants.js';
import type { SubscriptionPlan, SubscriptionStatus, WebhookEvent, WebhookResult } from '@/types.js';
import { LEMON_SQUEEZY_SUBSCRIPTION_STATUS, LEMON_SQUEEZY_WEBHOOK_EVENTS } from './constants.js';
import type {
  LemonSqueezySubscriptionStatus,
  LemonSqueezyWebhookPayload,
  LemonSqueezyVariantPlanMap,
} from './types.js';

export function verifyWebhookSignature(
  secret: string,
  signatureHeader: string | undefined,
  rawBody: Buffer,
): boolean {
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

export function readSubscriptionDates(
  payload: LemonSqueezyWebhookPayload,
): Readonly<Record<'renewsAt' | 'endsAt', string | undefined>> {
  const renewsAt = payload.data.attributes.renews_at ?? null;
  const endsAt = payload.data.attributes.ends_at ?? null;

  return {
    renewsAt: renewsAt ?? undefined,
    endsAt: endsAt ?? undefined,
  };
}

export function toSubscriptionStatus(
  status: LemonSqueezySubscriptionStatus | null,
): SubscriptionStatus | null {
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

export function resolvePlanFromVariantId(
  variantId: number,
  variantPlanMap: Readonly<Record<string, SubscriptionPlan>>,
): SubscriptionPlan | null {
  const plan = variantPlanMap[String(variantId)];

  return plan && (plan === SUBSCRIPTION_PLAN.PLUS || plan === SUBSCRIPTION_PLAN.PRO) ? plan : null;
}

function toWebhookEvent(eventName: string): WebhookEvent | null {
  switch (eventName) {
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.ORDER_CREATED:
      return 'purchased';
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_PAYMENT_FAILED:
      return 'payment_failed';
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_PAYMENT_RECOVERED:
      return 'payment_recovered';
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_CANCELLED:
      return 'subscription_cancelled';
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_EXPIRED:
      return 'subscription_expired';
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
      return 'subscription_updated';
    default:
      return null;
  }
}

export function normalizeWebhookPayload(
  payload: LemonSqueezyWebhookPayload,
  variantPlanMap: LemonSqueezyVariantPlanMap,
): WebhookResult | null {
  const userId = payload.meta.custom_data?.user_id;
  const event = toWebhookEvent(payload.meta.event_name);

  if (!userId || !event) {
    return null;
  }

  const customerId = payload.data.relationships.customer?.data?.id ?? undefined;
  const subscriptionId = payload.data.relationships.subscription?.data?.id ?? undefined;
  const { renewsAt, endsAt } = readSubscriptionDates(payload);

  if (event === 'purchased') {
    const variantId = payload.data.attributes.first_order_item?.variant_id;
    const plan = variantId ? resolvePlanFromVariantId(variantId, variantPlanMap) : null;

    if (!plan) {
      return null;
    }

    return {
      event,
      userId,
      plan,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      customerId,
      orderId: payload.data.id,
      subscriptionId,
      renewsAt,
      endsAt,
    };
  }

  const status = toSubscriptionStatus(payload.data.attributes.status) ?? undefined;

  return {
    event,
    userId,
    status,
    subscriptionId,
    renewsAt,
    endsAt,
  };
}
