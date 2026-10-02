'use client';

import { atom } from 'jotai';
import type { AuthUser } from '@/app/api/auth/types';

/**
 * Session state shared by every `NavBarAuth` instance: the top bar at `xl` and the
 * drawer footer below it. Owned by `useNavAuthSession` (see `hooks.ts`).
 */
export const navAuthUserAtom = atom<AuthUser | null>(null);
export const navAuthPendingCountAtom = atom(0);
export const navAuthReadyAtom = atom(false);
