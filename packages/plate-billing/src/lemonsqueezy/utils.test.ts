import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/constants.js';
import type { LemonSqueezySubscriptionStatus } from './types.js';
import {
  buildVariantPlanMap,
  normalizeWebhookPayload,
  readSubscriptionDates,
  resolvePlanFromVariantId,
  toSubscriptionStatus,
  verifyWebhookSignature,
} from './utils.js';
import { createLemonSqueezyProvider } from './provider.js';

const variantPlanMap = {
  '2060877': SUBSCRIPTION_PLAN.BASIC,
  '2060965': SUBSCRIPTION_PLAN.PRO,
} as const;

const webhookPayload = {
  meta: {
    event_name: 'order_created',
    custom_data: { user_id: 'user_1' },
  },
  data: {
    id: 'order_1',
    attributes: {
      first_order_item: { variant_id: 2060877 },
      status: null,
      test_mode: false,
      renews_at: '2026-10-01T12:00:00Z',
      ends_at: '2026-09-01T12:00:00Z',
    },
    relationships: {
      customer: { data: { id: 'customer_1' } },
      subscription: { data: { id: 'subscription_1' } },
    },
  },
} as const;

describe('verifyWebhookSignature', () => {
  const secret = 'signing-secret';

  it('accepts a valid signature', () => {
    const body = Buffer.from('{"hello":"world"}');
    const signature = createHmac('sha256', secret).update(body).digest('hex');

    expect(verifyWebhookSignature(secret, signature, body)).toBe(true);
  });

  it('rejects tampered bodies and missing headers', () => {
    const body = Buffer.from('{"hello":"world"}');
    const signature = createHmac('sha256', secret).update(body).digest('hex');

    expect(verifyWebhookSignature(secret, signature, Buffer.from('{"hello":"evil"}'))).toBe(false);
    expect(verifyWebhookSignature(secret, undefined, body)).toBe(false);
  });
});

describe('buildVariantPlanMap', () => {
  it('maps both variants to their plans', () => {
    const map = buildVariantPlanMap('2060877', '2060965');

    expect(map['2060877']).toBe(SUBSCRIPTION_PLAN.BASIC);
    expect(map['2060965']).toBe(SUBSCRIPTION_PLAN.PRO);
  });
});

describe('resolvePlanFromVariantId', () => {
  it('maps known variant ids', () => {
    expect(resolvePlanFromVariantId(2060877, variantPlanMap)).toBe(SUBSCRIPTION_PLAN.BASIC);
    expect(resolvePlanFromVariantId(2060965, variantPlanMap)).toBe(SUBSCRIPTION_PLAN.PRO);
  });

  it('returns null for unknown variant ids', () => {
    expect(resolvePlanFromVariantId(999, variantPlanMap)).toBeNull();
  });
});

describe('toSubscriptionStatus', () => {
  it('maps lemon statuses', () => {
    expect(toSubscriptionStatus('active')).toBe(SUBSCRIPTION_STATUS.ACTIVE);
    expect(toSubscriptionStatus('cancelled')).toBe(SUBSCRIPTION_STATUS.CANCELLED);
    expect(toSubscriptionStatus('expired')).toBe(SUBSCRIPTION_STATUS.EXPIRED);
  });

  it('returns null for untracked statuses', () => {
    expect(toSubscriptionStatus('paused' as LemonSqueezySubscriptionStatus)).toBeNull();
    expect(toSubscriptionStatus(null)).toBeNull();
  });
});

describe('readSubscriptionDates', () => {
  it('reads both dates when present', () => {
    expect(readSubscriptionDates(webhookPayload)).toEqual({
      renewsAt: '2026-10-01T12:00:00Z',
      endsAt: '2026-09-01T12:00:00Z',
    });
  });

  it('omits dates that are null or missing', () => {
    expect(
      readSubscriptionDates({
        ...webhookPayload,
        data: {
          ...webhookPayload.data,
          attributes: { ...webhookPayload.data.attributes, renews_at: null, ends_at: '2026-09-01T12:00:00Z' },
        },
      }),
    ).toEqual({ endsAt: '2026-09-01T12:00:00Z' });

    expect(
      readSubscriptionDates({
        ...webhookPayload,
        data: {
          ...webhookPayload.data,
          attributes: { ...webhookPayload.data.attributes, renews_at: undefined, ends_at: undefined },
        },
      }),
    ).toEqual({});
  });
});

describe('normalizeWebhookPayload', () => {
  it('normalizes an order_created purchase', () => {
    const result = normalizeWebhookPayload(webhookPayload, variantPlanMap);

    expect(result).toEqual({
      event: 'purchased',
      userId: 'user_1',
      plan: SUBSCRIPTION_PLAN.BASIC,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      customerId: 'customer_1',
      orderId: 'order_1',
      subscriptionId: 'subscription_1',
      renewsAt: '2026-10-01T12:00:00Z',
      endsAt: '2026-09-01T12:00:00Z',
    });
  });

  it('normalizes a subscription_created purchase with the subscription variant', () => {
    const payload = {
      meta: { event_name: 'subscription_created', custom_data: { user_id: 'user_1' } },
      data: {
        id: 'subscription_1',
        attributes: {
          first_order_item: null,
          first_subscription_item: { variant_id: 2060965 },
          status: 'active',
          test_mode: false,
          renews_at: '2026-10-01T12:00:00Z',
          ends_at: null,
        },
        relationships: {
          customer: { data: { id: 'customer_1' } },
          subscription: { data: { id: 'subscription_1' } },
        },
      },
    } as const;

    const result = normalizeWebhookPayload(payload, variantPlanMap);

    expect(result).toEqual({
      event: 'purchased',
      userId: 'user_1',
      plan: SUBSCRIPTION_PLAN.PRO,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      customerId: 'customer_1',
      orderId: 'subscription_1',
      subscriptionId: 'subscription_1',
      renewsAt: '2026-10-01T12:00:00Z',
      endsAt: undefined,
    });
  });

  it('carries the plan through a subscription_updated event so status and plan write together', () => {
    const payload = {
      meta: { event_name: 'subscription_updated', custom_data: { user_id: 'user_1' } },
      data: {
        id: 'subscription_1',
        attributes: {
          first_order_item: null,
          first_subscription_item: { variant_id: 2060877 },
          status: 'active',
          test_mode: false,
          renews_at: '2026-10-01T12:00:00Z',
          ends_at: null,
        },
        relationships: {
          customer: { data: { id: 'customer_1' } },
          subscription: { data: { id: 'subscription_1' } },
        },
      },
    } as const;

    const result = normalizeWebhookPayload(payload, variantPlanMap);

    expect(result).toEqual({
      event: 'subscription_updated',
      userId: 'user_1',
      plan: SUBSCRIPTION_PLAN.BASIC,
      status: SUBSCRIPTION_STATUS.ACTIVE,
      subscriptionId: 'subscription_1',
      renewsAt: '2026-10-01T12:00:00Z',
      endsAt: undefined,
    });
  });

  it('omits plan when the variant cannot be resolved', () => {
    const payload = {
      ...webhookPayload,
      data: {
        ...webhookPayload.data,
        attributes: {
          ...webhookPayload.data.attributes,
          first_order_item: { variant_id: 999999 },
        },
      },
    } as const;

    expect(normalizeWebhookPayload(payload, variantPlanMap)).toBeNull();
  });
});

describe('provider parseWebhook', () => {
  const provider = createLemonSqueezyProvider({
    id: 'lemonsqueezy',
    apiKey: 'api',
    storeId: 'store',
    webhookSecret: 'secret',
    variantIdBasic: '2060877',
    variantIdPro: '2060965',
    testMode: false,
  });

  it('applies a supported purchase event', () => {
    const parsed = provider.parseWebhook(Buffer.from(JSON.stringify(webhookPayload)));

    expect(parsed).toMatchObject({ status: 'applied' });
    if (parsed.status === 'applied') {
      expect(parsed.result.event).toBe('purchased');
    }
  });

  it('flags malformed bodies as invalid', () => {
    expect(provider.parseWebhook(Buffer.from('not json'))).toEqual({ status: 'invalid' });
  });

  it('ignores test_mode mismatches', () => {
    const payload = {
      ...webhookPayload,
      data: { ...webhookPayload.data, attributes: { ...webhookPayload.data.attributes, test_mode: true } },
    };

    expect(provider.parseWebhook(Buffer.from(JSON.stringify(payload)))).toEqual({ status: 'ignored' });
  });
});
