import { readPlateServerUrl } from '@/app/api/auth/utils';

export async function GET(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get('cookie');
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (!cookieHeader) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  try {
    const upstream = await fetch(`${readPlateServerUrl()}/checkout/portal`, {
      headers: {
        cookie: cookieHeader,
        ...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      const body = await upstream.json().catch(() => null);
      return Response.json(
        { error: (body as { error?: string } | null)?.error ?? 'Could not load portal.' },
        { status: upstream.status },
      );
    }

    const data = (await upstream.json()) as { url: string };
    return Response.json({ url: data.url });
  } catch {
    return Response.json({ error: 'Unable to reach our servers right now.' }, { status: 502 });
  }
}
