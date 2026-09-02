import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { isActivePaidPlan } from '@plate/plate-billing';
import { fetchAuthUser } from '@/app/api/auth/utils';
import { PRICING_PAGE } from '@/app/components/pricing/constants';
import PricingPage from '@/app/components/pricing/pricing-page';

export const metadata: Metadata = {
  title: 'Pricing · PlateAI',
  description: PRICING_PAGE.SUBTITLE,
};

export default async function Page(): Promise<ReactNode> {
  const user = await fetchAuthUser((await headers()).get('cookie'));

  if (user && isActivePaidPlan(user.subscriptionPlan, user.subscriptionStatus)) {
    redirect('/history');
  }

  return (
    <Suspense>
      <PricingPage />
    </Suspense>
  );
}
