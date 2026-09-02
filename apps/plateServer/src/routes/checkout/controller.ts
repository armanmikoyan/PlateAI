import type { NextFunction, Request, Response } from 'express';
import { isPaidPlan } from '@plate/plate-billing';
import type { CheckoutSessionResponse } from '@plate/plate-billing';
import { CHECKOUT_ERRORS } from '@/routes/checkout/constants.js';
import { createLemonCheckout, handleWebhookEvent } from '@/routes/checkout/service.js';
import { isWebhookPayload, verifyWebhookSignature } from '@/routes/checkout/utils.js';
import type { ServerConfig } from '@/config/types.js';

export async function createCheckoutSession(
  config: ServerConfig,
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

    const plan = (request.body as { plan?: unknown } | undefined)?.plan;

    if (typeof plan !== 'string' || !isPaidPlan(plan)) {
      response.status(400).json({ error: CHECKOUT_ERRORS.PLAN_NOT_PURCHASABLE });
      return;
    }

    const url = await createLemonCheckout(config, {
      email: authUser.email,
      name: authUser.name,
      userId: authUser.id,
      plan,
    });

    if (!url) {
      response.status(502).json({ error: CHECKOUT_ERRORS.CHECKOUT_FAILED });
      return;
    }

    response.json({ url } satisfies CheckoutSessionResponse);
  } catch (error) {
    next(error);
  }
}

export async function handleWebhook(
  config: ServerConfig,
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawBody = (request.body as Buffer | undefined) ?? Buffer.alloc(0);
    const signature = request.header('x-signature');
    const isValid = verifyWebhookSignature(
      config.LEMON_SQUEEZY_WEBHOOK_SECRET,
      signature ?? undefined,
      rawBody,
    );

    if (!isValid) {
      response.status(401).json({ error: CHECKOUT_ERRORS.INVALID_SIGNATURE });
      return;
    }

    let payload: unknown;

    try {
      payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      response.status(400).json({ error: CHECKOUT_ERRORS.INVALID_WEBHOOK_PAYLOAD });
      return;
    }

    if (!isWebhookPayload(payload)) {
      response.status(400).json({ error: CHECKOUT_ERRORS.INVALID_WEBHOOK_PAYLOAD });
      return;
    }

    await handleWebhookEvent(config, payload);

    response.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
}
