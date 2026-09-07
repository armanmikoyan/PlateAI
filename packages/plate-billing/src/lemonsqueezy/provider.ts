import { createCheckout, getSubscription, listSubscriptions, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { SUBSCRIPTION_PLAN } from '@/constants.js';
import type { CheckoutResult, CreateCheckoutInput, CustomerPortalResult, BillingProvider, WebhookParseResult } from '@/types.js';
import { CHECKOUT_ERROR } from '@/constants.js';
import {
  buildVariantPlanMap,
  isWebhookPayload,
  normalizeWebhookPayload,
  verifyWebhookSignature,
} from './utils.js';

export type LemonSqueezyProviderConfig = Readonly<{
  id: 'lemonsqueezy';
  apiKey: string;
  storeId: string;
  webhookSecret: string;
  variantIdBasic: string;
  variantIdPro: string;
  testMode: boolean;
}>;

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

      if (response.error !== null || response.data?.data.attributes.urls.customer_portal === undefined) {
        return { ok: false };
      }

      return { ok: true, url: response.data.data.attributes.urls.customer_portal };
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

      if (!subscription || subscription.attributes.urls.customer_portal === undefined) {
        return { ok: false };
      }

      return { ok: true, url: subscription.attributes.urls.customer_portal };
    },
  };
}
