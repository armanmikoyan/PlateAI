import { readPlateServerUrl } from '@/app/api/auth/utils';
import { isPurchasablePlan, isPlanUpgrade } from '@plate/plate-billing/utils';
import type { SubscriptionPlan } from '@plate/plate-billing/types';
import type { CheckoutSessionResponse } from '@plate/plate-billing/types';
import type { AuthMeResponse } from '@/app/api/auth/types';

export async function POST(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get('cookie');
  const payload = (await request.json()) as { plan?: unknown };
  const plan = typeof payload?.plan === 'string' ? payload.plan : '';

  if (!isPurchasablePlan(plan)) {
    return Response.json({ error: 'Could not start checkout.' }, { status: 400 });
  }

  const current = await readCurrentPlan(cookieHeader);

  if (current !== null && !isPlanUpgrade(plan, current)) {
    return Response.json({ error: 'This plan is already included.' }, { status: 400 });
  }

  const result = await createCheckoutSession(cookieHeader, plan);

  if (result.ok) {
    return Response.json({ url: result.url } satisfies CheckoutSessionResponse);
  }

  if (result.status === 401) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  return Response.json({ error: 'Could not start checkout.' }, { status: result.status });
}

async function readCurrentPlan(cookieHeader: string | null): Promise<SubscriptionPlan | null> {
  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${readPlateServerUrl()}/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AuthMeResponse;
    return payload.user.subscriptionPlan;
  } catch {
    return null;
  }
}

type CreateCheckoutSessionResult = { ok: true; url: string } | { ok: false; status: number };

async function createCheckoutSession(
  cookieHeader: string | null,
  plan: string,
): Promise<CreateCheckoutSessionResult> {
  if (!cookieHeader) {
    return { ok: false, status: 401 };
  }

  try {
    const response = await fetch(`${readPlateServerUrl()}/checkout/session`, {
      method: 'POST',
      headers: {
        cookie: cookieHeader,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ plan }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    const data = (await response.json()) as { url: string };
    return { ok: true, url: data.url };
  } catch {
    return { ok: false, status: 502 };
  }
}
