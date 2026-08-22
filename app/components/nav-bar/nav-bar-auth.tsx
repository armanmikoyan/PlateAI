'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/app/ui/button';
import { NAV_AUTH } from './constants';
import type { AuthMeResponse } from '@/lib/auth/types';

export function NavBarAuth() {
  const [userName, setUserName] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as AuthMeResponse;
        if (!cancelled) {
          setUserName(payload.user.name);
        }
      } catch {
        // Ignore — treat as signed out.
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  if (!userName) {
    return (
      <Button render={<Link href="/login" />} nativeButton={false} size="sm" variant="outline">
        {NAV_AUTH.SIGN_IN}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-content-muted hidden max-w-32 truncate text-sm sm:inline">{userName}</span>
      <Button render={<Link href="/api/auth/logout" />} nativeButton={false} size="sm" variant="ghost">
        {NAV_AUTH.SIGN_OUT}
      </Button>
    </div>
  );
}
