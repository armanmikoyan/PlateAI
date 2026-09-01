import { fetchAuthUser } from '@/app/api/auth/utils';
import type { AuthMeResponse } from '@/app/api/auth/types';

export async function GET(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get('cookie');
  const user = await fetchAuthUser(cookieHeader);

  if (!user) {
    return Response.json({ error: 'Not signed in.' }, { status: 401 });
  }

  return Response.json({ user } satisfies AuthMeResponse);
}
