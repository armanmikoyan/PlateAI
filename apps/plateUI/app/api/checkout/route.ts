import { readAuthServerUrl } from '@/app/api/auth/utils';
import type { CheckoutSessionResponse } from '@plate/plate-billing/types';

type CreateCheckoutSessionResult = { ok: true; url: string } | { ok: false; status: number };

async function createCheckoutSession(
  cookieHeader: string | null,
  plan: string,
): Promise<CreateCheckoutSessionResult> {
  if (!cookieHeader) {
    return { ok: false, status: 401 };
  }

  try {
    const response = await fetch(`${readAuthServerUrl()}/checkout/session`, {
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

export async function POST(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get('cookie');
  const payload = (await request.json()) as { plan?: unknown };
  const plan = typeof payload?.plan === 'string' ? payload.plan : '';
  const result = await createCheckoutSession(cookieHeader, plan);

  if (result.ok) {
    return Response.json({ url: result.url } satisfies CheckoutSessionResponse);
  }

  if (result.status === 401) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  return Response.json({ error: 'Could not start checkout.' }, { status: result.status });
}
