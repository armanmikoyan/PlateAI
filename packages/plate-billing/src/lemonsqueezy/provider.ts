import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { SUBSCRIPTION_PLAN } from '@/constants.js';
import type { CheckoutResult, CreateCheckoutInput, BillingProvider, WebhookParseResult } from '@/types.js';
import { CHECKOUT_ERROR } from '@/types.js';
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
  variantIdPlus: string;
  variantIdPro: string;
  testMode: boolean;
}>;

export function createLemonSqueezyProvider(config: LemonSqueezyProviderConfig): BillingProvider {
  const variantPlanMap = buildVariantPlanMap(config.variantIdPlus, config.variantIdPro);

  function variantIdForPlan(plan: CreateCheckoutInput['plan']): string {
    return plan === SUBSCRIPTION_PLAN.PLUS ? config.variantIdPlus : config.variantIdPro;
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

      if (payload.data.attributes.test_mode !== config.testMode) {
        return { status: 'ignored' };
      }

      const result = normalizeWebhookPayload(payload, variantPlanMap);

      if (!result) {
        return { status: 'ignored' };
      }

      return { status: 'applied', result };
    },
  };
}
