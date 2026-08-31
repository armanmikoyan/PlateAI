import { proxyToAuthServer } from '@/app/api/auth/utils';

export function GET(request: Request): Promise<Response> {
  return proxyToAuthServer(request, '/auth/google');
}
