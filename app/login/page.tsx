import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LOGIN } from '@/app/components/login/constants';
import { LoginPanel } from '@/app/components/login/login-panel';

type LoginPageProps = Readonly<{
  searchParams: Promise<{ error?: string; next?: string }>;
}>;

export const metadata: Metadata = {
  title: 'Sign in · PlateAI',
  description: LOGIN.SUBTITLE,
};

export default async function Page({ searchParams }: LoginPageProps): Promise<ReactNode> {
  const params = await searchParams;
  const error = params.error === 'google' ? LOGIN.ERROR_GOOGLE : null;

  return <LoginPanel error={error} />;
}
