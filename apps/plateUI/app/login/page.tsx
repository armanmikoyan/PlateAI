import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { LOGIN } from '@/app/components/login/constants';
import { LoginPanel } from '@/app/components/login/login-panel';
import { readLoginRedirectPath } from '@/app/components/login/utils';
import { getAuthSession } from '@/app/api/auth/utils';

type LoginPageProps = Readonly<{
  searchParams: Promise<{ error?: string; next?: string }>;
}>;

export const metadata: Metadata = {
  title: 'Sign in · PlateAI',
  description: LOGIN.SUBTITLE,
};

export default async function Page({ searchParams }: LoginPageProps): Promise<ReactNode> {
  const params = await searchParams;
  const pageHeaders = await headers();
  const session = await getAuthSession(pageHeaders.get('cookie'), pageHeaders.get('x-forwarded-for'));

  if (session) {
    redirect(readLoginRedirectPath(params.next));
  }

  const error = params.error === 'google' ? LOGIN.ERROR_GOOGLE : null;

  return <LoginPanel error={error} />;
}
