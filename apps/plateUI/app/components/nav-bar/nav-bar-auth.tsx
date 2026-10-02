'use client';

import Link from 'next/link';
import { useAtomValue } from 'jotai';
import { ChevronDownIcon, HistoryIcon, LogInIcon, LogOutIcon } from 'lucide-react';
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
import {
  NAV_AUTH,
  NAV_AUTH_ACCOUNT_TRIGGER_DRAWER_SHELL,
  NAV_AUTH_ACCOUNT_TRIGGER_SHELL,
  NAV_AUTH_LOADING_DRAWER_SHELL,
  NAV_AUTH_LOADING_SHELL,
  NAV_AUTH_SIGN_IN_DRAWER_SHELL,
  NAV_AUTH_SIGN_IN_SHELL,
} from './constants';
import { navAuthPendingCountAtom, navAuthReadyAtom, navAuthUserAtom } from './state';
import type { NavBarAuthProps } from './types';
import { initialsForName } from './utils';

export function NavBarAuth({ variant }: NavBarAuthProps) {
  const user = useAtomValue(navAuthUserAtom);
  const pendingCount = useAtomValue(navAuthPendingCountAtom);
  const ready = useAtomValue(navAuthReadyAtom);
  const isDrawer = variant === 'drawer';

  if (!ready) {
    return (
      <div aria-hidden className={isDrawer ? NAV_AUTH_LOADING_DRAWER_SHELL : NAV_AUTH_LOADING_SHELL}>
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
        className={isDrawer ? NAV_AUTH_SIGN_IN_DRAWER_SHELL : NAV_AUTH_SIGN_IN_SHELL}
        render={<Link href="/login" />}
        nativeButton={false}
        variant="outline"
      >
        <LogInIcon data-icon="inline-start" />
        {isDrawer ? NAV_AUTH.SIGN_IN : <span className="hidden xl:inline">{NAV_AUTH.SIGN_IN}</span>}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={NAV_AUTH.ACCOUNT_MENU}
        render={
          <Button
            className={isDrawer ? NAV_AUTH_ACCOUNT_TRIGGER_DRAWER_SHELL : NAV_AUTH_ACCOUNT_TRIGGER_SHELL}
            variant="ghost"
          />
        }
      >
        <Avatar className="size-7 after:hidden sm:size-8">
          <AvatarFallback className="bg-surface-overlay text-content text-[10px] font-semibold sm:text-xs">
            {initialsForName(user.name)}
          </AvatarFallback>
        </Avatar>
        {isDrawer ? (
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{user.name}</span>
        ) : (
          <span className="hidden max-w-28 truncate text-xs font-medium sm:inline sm:max-w-32 sm:text-sm">
            {user.name}
          </span>
        )}
        {isDrawer ? (
          <ChevronDownIcon className="text-muted-foreground size-4" />
        ) : (
          <ChevronDownIcon className="text-muted-foreground hidden size-3.5 sm:inline sm:size-4" />
        )}
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
          <DropdownMenuItem
            className="cursor-pointer"
            render={<Link href={NAV_AUTH.MEAL_HISTORY_HREF} />}
            nativeButton={false}
          >
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
            // oxlint-disable-next-line nextjs/no-html-link-for-pages
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
