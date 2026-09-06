import { NextResponse } from 'next/server';
import { readPlateServerUrl } from '@/app/api/auth/utils';
import { CONTACT_SECTION } from '@/app/components/contact/constants';
import { retryAfterSecondsFromHeader } from '@/app/utils/rate-limit/utils';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json().catch(() => null)) as {
    message?: unknown;
  } | null;

  const message = typeof body?.message === 'string' ? body.message : '';

  if (!message) {
    return NextResponse.json({ error: CONTACT_SECTION.FORM_INVALID }, { status: 400 });
  }

  const cookieHeader = request.headers.get('cookie');
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (!cookieHeader) {
    return NextResponse.json({ error: CONTACT_SECTION.SIGN_IN_REQUIRED }, { status: 401 });
  }

  let response: Response;

  try {
    response = await fetch(`${readPlateServerUrl()}/contact`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: cookieHeader,
        ...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
      },
      body: JSON.stringify({ message }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ error: CONTACT_SECTION.FORM_SERVER_UNAVAILABLE }, { status: 502 });
  }

  if (!response.ok) {
    const upstream = (await response.json().catch(() => null)) as { error?: string } | null;

    if (response.status === 429) {
      return NextResponse.json(
        {
          error: upstream?.error ?? CONTACT_SECTION.FORM_ERROR,
          retryAfterSeconds: retryAfterSecondsFromHeader(response.headers.get('retry-after')),
        },
        { status: 429 },
      );
    }

    return NextResponse.json({ error: upstream?.error ?? CONTACT_SECTION.FORM_ERROR }, { status: response.status });
  }

  return NextResponse.json({ ok: true });
}
