import type { NextFunction, Request, Response } from 'express';
import { isPurchasablePlan } from '@plate/plate-billing/utils';
import type { BillingProvider, CheckoutSessionResponse } from '@plate/plate-billing/types';
import { CHECKOUT_ERRORS } from '@/routes/checkout/constants.js';
import { applyWebhookResult, createCheckout } from '@/routes/checkout/service.js';
import type { ServerConfig } from '@/config/types.js';

export function createCheckoutSessionHandler(provider: BillingProvider, config: ServerConfig) {
  return async function handleCreateCheckoutSession(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authUser = request.authUser;

      if (!authUser) {
        response.status(401).json({ error: CHECKOUT_ERRORS.NOT_SIGNED_IN });
        return;
      }

      const bodyPlan = (request.body as { plan?: unknown } | undefined)?.plan;

      if (typeof bodyPlan !== 'string' || !isPurchasablePlan(bodyPlan)) {
        response.status(400).json({ error: CHECKOUT_ERRORS.PLAN_NOT_PURCHASABLE });
        return;
      }

      const outcome = await createCheckout(provider, {
        email: authUser.email,
        name: authUser.name,
        customerRef: authUser.id,
        plan: bodyPlan,
        redirectUrl: `${config.FRONTEND_URL}/history?checkout=success`,
      });

      if (!outcome.url) {
        response.status(502).json({ error: CHECKOUT_ERRORS.CHECKOUT_FAILED });
        return;
      }

      response.json({ url: outcome.url } satisfies CheckoutSessionResponse);
    } catch (error) {
      next(error);
    }
  };
}

export function createWebhookHandler(provider: BillingProvider) {
  return async function handleWebhook(
    request: Request,
    response: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const rawBody = (request.body as Buffer | undefined) ?? Buffer.alloc(0);
      const signature = request.header('x-signature');

      if (!provider.verifyWebhookSignature(rawBody, signature)) {
        response.status(401).json({ error: CHECKOUT_ERRORS.INVALID_SIGNATURE });
        return;
      }

      const parsed = provider.parseWebhook(rawBody);

      if (parsed.status === 'invalid') {
        response.status(400).json({ error: CHECKOUT_ERRORS.INVALID_WEBHOOK_PAYLOAD });
        return;
      }

      if (parsed.status === 'applied') {
        await applyWebhookResult(parsed.result);
      }

      response.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  };
}
