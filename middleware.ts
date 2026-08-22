import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuthSession } from '@/lib/auth/jwt';

function loginRedirect(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const session = await getAuthSession(request.headers.get('cookie'));

  if (session) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith('/api/snap/')) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  return loginRedirect(request);
}

export const config = {
  matcher: ['/snap/:path*', '/api/snap/:path*'],
};
