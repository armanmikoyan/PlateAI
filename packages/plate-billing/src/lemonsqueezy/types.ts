import type { SubscriptionPlan } from '@/types.js';

export type LemonSqueezyWebhookEvent =
  | 'order_created'
  | 'subscription_created'
  | 'subscription_updated'
  | 'subscription_cancelled'
  | 'subscription_expired'
  | 'subscription_payment_failed'
  | 'subscription_payment_recovered';

export type LemonSqueezySubscriptionStatus = 'active' | 'cancelled' | 'expired';

export type LemonSqueezyCheckoutCustom = Readonly<{
  user_id: string;
}>;

type LemonSqueezyRelationshipData = Readonly<{
  id: string;
}>;

export type LemonSqueezyWebhookPayload = Readonly<{
  meta: Readonly<{
    event_name: LemonSqueezyWebhookEvent;
    custom_data: LemonSqueezyCheckoutCustom | null;
  }>;
  data: Readonly<{
    id: string;
    attributes: Readonly<{
      first_order_item: Readonly<{
        variant_id: number;
      }> | null;
      first_subscription_item?: Readonly<{
        variant_id: number;
      }> | null;
      status: LemonSqueezySubscriptionStatus | null;
      test_mode: boolean;
      renews_at?: string | null;
      ends_at?: string | null;
    }>;
    relationships: Readonly<{
      customer: Readonly<{
        data: LemonSqueezyRelationshipData | null;
      }>;
      subscription: Readonly<{
        data: LemonSqueezyRelationshipData | null;
      }>;
    }>;
  }>;
}>;

export type LemonSqueezyVariantPlanMap = Readonly<Record<string, SubscriptionPlan>>;
