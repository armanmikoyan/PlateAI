import { readAuthServerUrl } from '@/lib/auth/config';
import type { AuthMeResponse, AuthUser } from '@/lib/auth/types';

export async function fetchAuthUser(cookieHeader: string | null): Promise<AuthUser | null> {
  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${readAuthServerUrl()}/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AuthMeResponse;
    return payload.user ?? null;
  } catch {
    return null;
  }
}
