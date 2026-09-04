import type { BillingProviderConfig } from '@plate/plate-billing/provider';
import type { WebhookResult } from '@plate/plate-billing/types';
import type { ApplySubscriptionUpdate } from '@/routes/checkout/repository.js';
import type { ServerConfig } from '@/config/types.js';

export function toBillingProviderConfig(config: ServerConfig): BillingProviderConfig {
  return {
    id: 'lemonsqueezy',
    apiKey: config.LEMON_SQUEEZY_API_KEY,
    storeId: config.LEMON_SQUEEZY_STORE_ID,
    webhookSecret: config.LEMON_SQUEEZY_WEBHOOK_SECRET,
    variantIdBasic: config.LEMON_SQUEEZY_VARIANT_ID_BASIC,
    variantIdPro: config.LEMON_SQUEEZY_VARIANT_ID_PRO,
    testMode: config.LEMON_SQUEEZY_TEST_MODE,
  };
}

export function toSubscriptionUpdate(result: WebhookResult): ApplySubscriptionUpdate {
  return {
    ...(result.plan ? { subscriptionPlan: result.plan } : {}),
    ...(result.status ? { subscriptionStatus: result.status } : {}),
    ...(result.customerId ? { billingCustomerId: result.customerId } : {}),
    ...(result.orderId ? { billingOrderId: result.orderId } : {}),
    ...(result.subscriptionId ? { billingSubscriptionId: result.subscriptionId } : {}),
    ...(result.renewsAt ? { subscriptionRenewsAt: result.renewsAt } : {}),
    ...(result.endsAt ? { subscriptionEndsAt: result.endsAt } : {}),
  };
}
