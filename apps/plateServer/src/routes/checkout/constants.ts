export const CHECKOUT_ERRORS = {
  INVALID_BODY: 'Invalid request body.',
  PLAN_NOT_PURCHASABLE: 'This plan cannot be purchased.',
  CHECKOUT_FAILED: 'Could not start checkout.',
  NOT_SIGNED_IN: 'Not signed in.',
  INVALID_SIGNATURE: 'Invalid signature.',
  WEBHOOK_EVENT_UNSUPPORTED: 'Unsupported webhook event.',
  USER_NOT_FOUND: 'User not found.',
  INVALID_WEBHOOK_PAYLOAD: 'Invalid webhook payload.',
} as const;

export const LEMON_SQUEEZY_WEBHOOK_EVENTS = {
  ORDER_CREATED: 'order_created',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_UPDATED: 'subscription_updated',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
  SUBSCRIPTION_EXPIRED: 'subscription_expired',
  SUBSCRIPTION_PAYMENT_FAILED: 'subscription_payment_failed',
  SUBSCRIPTION_PAYMENT_RECOVERED: 'subscription_payment_recovered',
} as const;

export const LEMON_SQUEEZY_SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;
