import { createCheckout, lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@plate/plate-billing';
import type { SubscriptionPlan } from '@plate/plate-billing';
import { LEMON_SQUEEZY_WEBHOOK_EVENTS } from '@/routes/checkout/constants.js';
import type { LemonSqueezyWebhookPayload } from '@/routes/checkout/types.js';
import type { ServerConfig } from '@/config/types.js';
import {
  buildVariantPlanMap,
  readSubscriptionDates,
  resolvePlanFromVariantId,
  toSubscriptionStatus,
} from '@/routes/checkout/utils.js';
import { applySubscription, findUserById } from '@/routes/checkout/repository.js';

type CreateCheckoutInput = Readonly<{
  email: string;
  name: string;
  userId: string;
  plan: SubscriptionPlan;
}>;

export async function createLemonCheckout(
  config: ServerConfig,
  input: CreateCheckoutInput,
): Promise<string | null> {
  const variantId =
    input.plan === SUBSCRIPTION_PLAN.PLUS
      ? config.LEMON_SQUEEZY_VARIANT_ID_PLUS
      : config.LEMON_SQUEEZY_VARIANT_ID_PRO;

  lemonSqueezySetup({ apiKey: config.LEMON_SQUEEZY_API_KEY });

  const checkout = await createCheckout(config.LEMON_SQUEEZY_STORE_ID, String(variantId), {
    checkoutOptions: {
      embed: false,
    },
    productOptions: {
      enabledVariants: [Number(variantId)],
      redirectUrl: `${config.FRONTEND_URL}/history?checkout=success`,
    },
    checkoutData: {
      email: input.email,
      name: input.name,
      custom: { user_id: input.userId },
    },
  });

  if (checkout.error !== null || checkout.data?.data.attributes.url === undefined) {
    return null;
  }

  return checkout.data.data.attributes.url;
}

export async function handleWebhookEvent(
  config: ServerConfig,
  payload: LemonSqueezyWebhookPayload,
): Promise<boolean> {
  if (payload.data.attributes.test_mode !== config.LEMON_SQUEEZY_TEST_MODE) {
    return false;
  }

  const userId = payload.meta.custom_data?.user_id;

  if (!userId) {
    return false;
  }

  const user = await findUserById(userId);

  if (!user) {
    return false;
  }

  const customerId = payload.data.relationships.customer?.data?.id ?? null;
  const subscriptionId = payload.data.relationships.subscription?.data?.id ?? null;

  switch (payload.meta.event_name) {
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.ORDER_CREATED: {
      const variantId = payload.data.attributes.first_order_item?.variant_id;
      const plan = variantId
        ? resolvePlanFromVariantId(
            variantId,
            buildVariantPlanMap(config.LEMON_SQUEEZY_VARIANT_ID_PLUS, config.LEMON_SQUEEZY_VARIANT_ID_PRO),
          )
        : null;

      if (!plan) {
        return false;
      }

      await applySubscription(userId, {
        subscriptionPlan: plan,
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
        lemonCustomerId: customerId ?? undefined,
        lemonOrderId: payload.data.id,
        lemonSubscriptionId: subscriptionId ?? undefined,
      });

      return true;
    }

    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_PAYMENT_FAILED:
      await applySubscription(userId, {
        subscriptionStatus: SUBSCRIPTION_STATUS.EXPIRED,
        lemonSubscriptionId: subscriptionId ?? undefined,
        ...readSubscriptionDates(payload),
      });

      return true;

    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_PAYMENT_RECOVERED:
      await applySubscription(userId, {
        subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
        lemonSubscriptionId: subscriptionId ?? undefined,
        ...readSubscriptionDates(payload),
      });

      return true;

    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_CANCELLED:
    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_EXPIRED:
      await applySubscription(userId, {
        subscriptionStatus: toSubscriptionStatus(payload.data.attributes.status) ?? undefined,
        lemonSubscriptionId: subscriptionId ?? undefined,
        ...readSubscriptionDates(payload),
      });

      return true;

    case LEMON_SQUEEZY_WEBHOOK_EVENTS.SUBSCRIPTION_UPDATED:
      await applySubscription(userId, {
        subscriptionStatus: toSubscriptionStatus(payload.data.attributes.status) ?? undefined,
        lemonSubscriptionId: subscriptionId ?? undefined,
        ...readSubscriptionDates(payload),
      });

      return true;

    default:
      return false;
  }
}
