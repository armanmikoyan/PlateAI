import { proxyAuthRequest } from '@/lib/auth/session';

type AuthRouteContext = Readonly<{
  params: Promise<{ path: string[] }>;
}>;

async function handleAuthProxy(request: Request, context: AuthRouteContext): Promise<Response> {
  const { path } = await context.params;
  return proxyAuthRequest(request, path);
}

export async function GET(request: Request, context: AuthRouteContext): Promise<Response> {
  return handleAuthProxy(request, context);
}

export async function POST(request: Request, context: AuthRouteContext): Promise<Response> {
  return handleAuthProxy(request, context);
}
