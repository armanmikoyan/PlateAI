import { readAuthServerUrl } from '@/lib/auth/config';

function upstreamResponseHeaders(upstream: Response): Headers {
  const headers = new Headers();

  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'set-cookie') {
      return;
    }
    headers.set(key, value);
  });

  const setCookies = upstream.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      headers.append('set-cookie', cookie);
    }
  } else {
    const cookie = upstream.headers.get('set-cookie');
    if (cookie) {
      headers.append('set-cookie', cookie);
    }
  }

  return headers;
}

export async function proxyAuthRequest(request: Request, pathSegments: readonly string[]): Promise<Response> {
  const targetPath = pathSegments.join('/');
  const requestUrl = new URL(request.url);
  const targetUrl = `${readAuthServerUrl()}/auth/${targetPath}${requestUrl.search}`;

  const headers = new Headers();
  const cookie = request.headers.get('cookie');

  if (cookie) {
    headers.set('cookie', cookie);
  }

  const contentType = request.headers.get('content-type');

  if (contentType) {
    headers.set('content-type', contentType);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: 'manual',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(targetUrl, init);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstreamResponseHeaders(upstream),
  });
}
