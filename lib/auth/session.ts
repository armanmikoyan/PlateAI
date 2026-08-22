import { readAuthServerUrl } from '@/lib/auth/config';

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
  const responseHeaders = new Headers(upstream.headers);

  return new Response(upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}
