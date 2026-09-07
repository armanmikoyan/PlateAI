import { createCheckout, getSubscription, listSubscriptions, getOrder, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { SUBSCRIPTION_PLAN } from '@/constants.js';
import type { CheckoutResult, CreateCheckoutInput, CustomerPortalResult, BillingProvider, WebhookParseResult } from '@/types.js';
import { CHECKOUT_ERROR } from '@/constants.js';
import {
  buildVariantPlanMap,
  isWebhookPayload,
  normalizeWebhookPayload,
  verifyWebhookSignature,
} from './utils.js';
import type { LemonSqueezyProviderConfig } from './types.js';

export type { LemonSqueezyProviderConfig } from './types.js';

export function createLemonSqueezyProvider(config: LemonSqueezyProviderConfig): BillingProvider {
  const variantPlanMap = buildVariantPlanMap(config.variantIdBasic, config.variantIdPro);

  function variantIdForPlan(plan: CreateCheckoutInput['plan']): string {
    return plan === SUBSCRIPTION_PLAN.BASIC ? config.variantIdBasic : config.variantIdPro;
  }

  return {
    async createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult> {
      lemonSqueezySetup({ apiKey: config.apiKey });

      const variantId = variantIdForPlan(input.plan);

      const checkout = await createCheckout(config.storeId, String(variantId), {
        checkoutOptions: {
          embed: false,
        },
        productOptions: {
          enabledVariants: [Number(variantId)],
          redirectUrl: input.redirectUrl,
        },
        checkoutData: {
          email: input.email,
          name: input.name,
          custom: { user_id: input.customerRef },
        },
      });

      if (checkout.error !== null || checkout.data?.data.attributes.url === undefined) {
        return { ok: false, error: CHECKOUT_ERROR.PROVIDER_FAILED };
      }

      return { ok: true, url: checkout.data.data.attributes.url };
    },

    verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean {
      return verifyWebhookSignature(config.webhookSecret, signature, rawBody);
    },

    parseWebhook(rawBody: Buffer): WebhookParseResult {
      let payload: unknown;

      try {
        payload = JSON.parse(rawBody.toString('utf8'));
      } catch {
        return { status: 'invalid' };
      }

      if (!isWebhookPayload(payload)) {
        return { status: 'invalid' };
      }

      if (
        payload.data.attributes.test_mode !== undefined &&
        payload.data.attributes.test_mode !== config.testMode
      ) {
        return {
          status: 'ignored',
          reason: `test_mode mismatch (payload=${payload.data.attributes.test_mode}, config=${config.testMode})`,
        };
      }

      const normalized = normalizeWebhookPayload(payload, variantPlanMap);

      if (!normalized.ok) {
        return { status: 'ignored', reason: normalized.reason };
      }

      return { status: 'applied', result: normalized.result };
    },

    async getCustomerPortalUrl(subscriptionId: string): Promise<CustomerPortalResult> {
      lemonSqueezySetup({ apiKey: config.apiKey });

      const response = await getSubscription(subscriptionId);
      const orderId = response.data?.data.attributes.order_id;

      if (response.error !== null || !orderId) {
        return { ok: false };
      }

      const order = await getOrder(orderId);
      const receiptUrl = order.data?.data.attributes.urls.receipt;

      if (order.error !== null || !receiptUrl) {
        return { ok: false };
      }

      return { ok: true, url: receiptUrl };
    },

    async findCustomerPortalUrlByEmail(email: string): Promise<CustomerPortalResult> {
      lemonSqueezySetup({ apiKey: config.apiKey });

      const response = await listSubscriptions({
        filter: { userEmail: email, storeId: config.storeId },
      });

      if (response.error !== null || !response.data?.data) {
        return { ok: false };
      }

      const subscription = response.data.data.find(
        (sub) => sub.attributes.status === 'active' || sub.attributes.status === 'cancelled',
      );

      if (!subscription) {
        return { ok: false };
      }

      const orderId = subscription.attributes.order_id;

      if (!orderId) {
        return { ok: false };
      }

      const order = await getOrder(orderId);
      const receiptUrl = order.data?.data.attributes.urls.receipt;

      if (order.error !== null || !receiptUrl) {
        return { ok: false };
      }

      return { ok: true, url: receiptUrl };
    },
  };
}
