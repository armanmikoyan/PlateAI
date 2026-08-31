'use client';

import Link from 'next/link';
import { ChevronDownIcon, HistoryIcon, LogInIcon, LogOutIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { NAV_AUTH, NAV_AUTH_ACCOUNT_TRIGGER_SHELL, NAV_AUTH_LOADING_SHELL } from './constants';
import { initialsForName } from './utils';
import { Avatar, AvatarFallback } from '@/app/ui/avatar';
import { Button } from '@/app/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/ui/dropdown-menu';
import type { AuthMeResponse, AuthUser } from '@/app/api/auth/types';
import { MEAL_ANALYSES_CHANGED_EVENT } from '@/app/utils/meal-analyses/constants';
import { pendingMealCount } from '@/app/components/meal-history/utils';
import { fetchMealHistory } from '@/app/components/meal-history/utils';

export function NavBarAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPendingCount() {
      const history = await fetchMealHistory();
      if (!cancelled && history) {
        setPendingCount(pendingMealCount(history.items));
      }
    }

    async function loadSession() {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as AuthMeResponse;
        if (!cancelled) {
          setUser(payload.user);
        }

        void loadPendingCount();
      } catch {
        // Ignore — treat as signed out.
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    void loadSession();

    function handleMealAnalysesChanged() {
      void loadPendingCount();
    }

    window.addEventListener(MEAL_ANALYSES_CHANGED_EVENT, handleMealAnalysesChanged);

    return () => {
      cancelled = true;
      window.removeEventListener(MEAL_ANALYSES_CHANGED_EVENT, handleMealAnalysesChanged);
    };
  }, []);

  if (!ready) {
    return (
      <div aria-hidden className={NAV_AUTH_LOADING_SHELL}>
        <div className="size-7 shrink-0 rounded-full bg-muted/60 sm:size-8" />
        <div className="hidden h-4 w-20 max-w-28 rounded bg-muted/60 sm:block sm:max-w-32" />
        <div className="hidden size-3.5 shrink-0 rounded-sm bg-muted/60 sm:block sm:size-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button
        aria-label={NAV_AUTH.SIGN_IN}
        className="h-8 shrink-0 gap-1.5 px-2.5 text-xs sm:h-9 sm:px-4 sm:text-sm"
        render={<Link href="/login" />}
        nativeButton={false}
        variant="outline"
      >
        <LogInIcon data-icon="inline-start" />
        <span className="hidden xl:inline">{NAV_AUTH.SIGN_IN}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={NAV_AUTH.ACCOUNT_MENU}
        render={
          <Button
            className={NAV_AUTH_ACCOUNT_TRIGGER_SHELL}
            variant="ghost"
          />
        }
      >
        <Avatar className="size-7 after:hidden sm:size-8">
          <AvatarFallback className="bg-surface-overlay text-content text-[10px] font-semibold sm:text-xs">
            {initialsForName(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-28 truncate text-xs font-medium sm:inline sm:max-w-32 sm:text-sm">
          {user.name}
        </span>
        <ChevronDownIcon className="text-muted-foreground hidden size-3.5 sm:inline sm:size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
            <span className="truncate font-medium text-foreground">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" render={<Link href={NAV_AUTH.MEAL_HISTORY_HREF} />} nativeButton={false}>
            <HistoryIcon />
            {NAV_AUTH.MEAL_HISTORY}
            {pendingCount > 0 ? (
              <span className="text-muted-foreground ml-auto text-xs">
                {pendingCount} {NAV_AUTH.MEAL_HISTORY_PENDING_LABEL}
              </span>
            ) : null}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            // Full-page navigation so the auth server can clear the session cookie.
            render={<a href="/api/auth/logout" />}
            nativeButton={false}
          >
            <LogOutIcon />
            {NAV_AUTH.SIGN_OUT}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
