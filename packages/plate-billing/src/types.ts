import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/constants.js';

export type SubscriptionPlan = (typeof SUBSCRIPTION_PLAN)[keyof typeof SUBSCRIPTION_PLAN];

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

export const CHECKOUT_ERROR = {
  UNSUPPORTED_PLAN: 'UNSUPPORTED_PLAN',
  PROVIDER_FAILED: 'PROVIDER_FAILED',
} as const;

export type CheckoutError = (typeof CHECKOUT_ERROR)[keyof typeof CHECKOUT_ERROR];

export type CheckoutSuccess = Readonly<{
  ok: true;
  url: string;
}>;

export type CheckoutFailure = Readonly<{
  ok: false;
  error: CheckoutError;
}>;

export type CheckoutResult = CheckoutSuccess | CheckoutFailure;

export type CheckoutSessionResponse = Readonly<{
  url: string;
}>;

export type CreateCheckoutInput = Readonly<{
  email: string;
  name: string;
  customerRef: string;
  plan: Exclude<SubscriptionPlan, 'individual'>;
  redirectUrl: string;
}>;

export type BillingProviderId = 'lemonsqueezy';

export type WebhookEvent =
  | 'purchased'
  | 'payment_failed'
  | 'payment_recovered'
  | 'subscription_cancelled'
  | 'subscription_expired'
  | 'subscription_updated';

export type WebhookResult = Readonly<{
  event: WebhookEvent;
  userId: string;
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  customerId?: string;
  orderId?: string;
  subscriptionId?: string;
  renewsAt?: string;
  endsAt?: string;
}>;

export type WebhookParseResult =
  | Readonly<{ status: 'invalid' }>
  | Readonly<{ status: 'ignored' }>
  | Readonly<{ status: 'applied'; result: WebhookResult }>;

export type BillingProvider = Readonly<{
  createCheckout(input: CreateCheckoutInput): Promise<CheckoutResult>;
  verifyWebhookSignature(rawBody: Buffer, signature: string | undefined): boolean;
  parseWebhook(rawBody: Buffer): WebhookParseResult;
}>;
