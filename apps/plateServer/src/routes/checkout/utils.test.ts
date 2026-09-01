import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  buildVariantPlanMap,
  isPurchasablePlan,
  isWebhookPayload,
  readSubscriptionDates,
  resolvePlanFromVariantId,
  toSubscriptionStatus,
  verifyWebhookSignature,
} from './utils.js';
import type { LemonSqueezySubscriptionStatus } from './types.js';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/routes/meal-analyses/constants.js';

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
    const map = buildVariantPlanMap('2060965', '2060966');

    expect(map['2060965']).toBe(SUBSCRIPTION_PLAN.PLUS);
    expect(map['2060966']).toBe(SUBSCRIPTION_PLAN.PRO);
  });
});

describe('isPurchasablePlan', () => {
  it('accepts plus and pro', () => {
    expect(isPurchasablePlan(SUBSCRIPTION_PLAN.PLUS)).toBe(true);
    expect(isPurchasablePlan(SUBSCRIPTION_PLAN.PRO)).toBe(true);
  });

  it('rejects basic and unknown plans', () => {
    expect(isPurchasablePlan(SUBSCRIPTION_PLAN.BASIC)).toBe(false);
    expect(isPurchasablePlan('lifetime')).toBe(false);
  });
});

describe('resolvePlanFromVariantId', () => {
  const variantPlanMap = {
    '2060965': SUBSCRIPTION_PLAN.PLUS,
    '2060966': SUBSCRIPTION_PLAN.PRO,
  } as const;

  it('maps known variant ids', () => {
    expect(resolvePlanFromVariantId(2060965, variantPlanMap)).toBe(SUBSCRIPTION_PLAN.PLUS);
    expect(resolvePlanFromVariantId(2060966, variantPlanMap)).toBe(SUBSCRIPTION_PLAN.PRO);
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
  const payload = {
    meta: {
      event_name: 'subscription_updated',
      custom_data: { user_id: 'user_1' },
    },
    data: {
      id: '1',
      attributes: {
        first_order_item: null,
        status: 'active',
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

  it('reads both dates when present', () => {
    expect(readSubscriptionDates(payload)).toEqual({
      subscriptionRenewsAt: '2026-10-01T12:00:00Z',
      subscriptionEndsAt: '2026-09-01T12:00:00Z',
    });
  });

  it('omits dates that are null or missing', () => {
    expect(
      readSubscriptionDates({
        ...payload,
        data: {
          ...payload.data,
          attributes: {
            ...payload.data.attributes,
            renews_at: null,
            ends_at: '2026-09-01T12:00:00Z',
          },
        },
      }),
    ).toEqual({ subscriptionEndsAt: '2026-09-01T12:00:00Z' });

    expect(
      readSubscriptionDates({
        ...payload,
        data: {
          ...payload.data,
          attributes: {
            ...payload.data.attributes,
            renews_at: undefined,
            ends_at: undefined,
          },
        },
      }),
    ).toEqual({});
  });
});

describe('isWebhookPayload', () => {
  const payload = {
    meta: {
      event_name: 'order_created',
      custom_data: { user_id: 'user_1' },
    },
    data: {
      id: '1',
      attributes: {
        first_order_item: { variant_id: 2060965 },
        status: null,
        test_mode: true,
      },
      relationships: {},
    },
  };

  it('accepts a well-formed payload', () => {
    expect(isWebhookPayload(payload)).toBe(true);
  });

  it('rejects payloads missing the user id', () => {
    expect(
      isWebhookPayload({
        ...payload,
        meta: { ...payload.meta, custom_data: {} },
      }),
    ).toBe(false);
  });

  it('rejects payloads missing test_mode', () => {
    expect(
      isWebhookPayload({
        ...payload,
        data: {
          ...payload.data,
          attributes: { ...payload.data.attributes, test_mode: undefined },
        },
      }),
    ).toBe(false);
  });
});
