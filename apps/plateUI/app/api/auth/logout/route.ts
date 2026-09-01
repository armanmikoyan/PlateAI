import { cookies } from 'next/headers';

import { AUTH } from '@/app/api/auth/constants';
import { readSiteUrl } from '@/app/utils/site/url';

export async function GET(): Promise<Response> {
  (await cookies()).delete(AUTH.COOKIE_NAME);
  return Response.redirect(new URL('/', readSiteUrl()));
}
