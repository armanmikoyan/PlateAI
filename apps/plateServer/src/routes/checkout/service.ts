import type { BillingProvider, CreateCheckoutInput, WebhookResult } from '@plate/plate-billing/types';
import { applySubscription, findUserById } from '@/routes/checkout/repository.js';
import { toSubscriptionUpdate } from '@/routes/checkout/utils.js';
import type { CreateCheckoutOutcome } from '@/routes/checkout/types.js';

export async function createCheckout(
  provider: BillingProvider,
  input: CreateCheckoutInput,
): Promise<CreateCheckoutOutcome> {
  const result = await provider.createCheckout(input);

  if (result.ok) {
    return { url: result.url };
  }

  return { error: result.error };
}

export async function applyWebhookResult(result: WebhookResult): Promise<boolean> {
  const user = await findUserById(result.userId);

  if (!user) {
    return false;
  }

  await applySubscription(result.userId, toSubscriptionUpdate(result));

  return true;
}
