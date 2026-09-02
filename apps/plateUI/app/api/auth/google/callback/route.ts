import { proxyToApiServer } from '@/app/api/auth/utils';

export function GET(request: Request): Promise<Response> {
  return proxyToApiServer(request, '/auth/google/callback');
}
