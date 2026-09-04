import { NextResponse } from 'next/server';
import { readPlateServerUrl } from '@/app/api/auth/utils';
import { CONTACT_SECTION } from '@/app/components/contact/constants';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    message?: unknown;
  } | null;

  const email = typeof body?.email === 'string' ? body.email : '';
  const message = typeof body?.message === 'string' ? body.message : '';

  if (!email || !message) {
    return NextResponse.json({ error: CONTACT_SECTION.FORM_INVALID }, { status: 400 });
  }

  let response: Response;

  try {
    response = await fetch(`${readPlateServerUrl()}/contact`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, message }),
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ error: CONTACT_SECTION.FORM_SERVER_UNAVAILABLE }, { status: 502 });
  }

  if (!response.ok) {
    return NextResponse.json({ error: CONTACT_SECTION.FORM_ERROR }, { status: response.status });
  }

  return NextResponse.json({ ok: true });
}
