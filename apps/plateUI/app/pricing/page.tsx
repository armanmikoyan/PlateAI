import type { Metadata } from 'next';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { isActivePaidPlan } from '@plate/plate-billing/utils';
import { fetchAuthUser } from '@/app/api/auth/utils';
import { PRICING_PAGE } from '@/app/components/pricing/constants';
import PricingPage from '@/app/components/pricing/pricing-page';

export const metadata: Metadata = {
  title: 'Pricing · PlateAI',
  description: PRICING_PAGE.SUBTITLE,
};

export default async function Page(): Promise<ReactNode> {
  const pageHeaders = await headers();
  const user = await fetchAuthUser(pageHeaders.get('cookie'), pageHeaders.get('x-forwarded-for'));
  const currentPlanId =
    user && isActivePaidPlan(user.subscriptionPlan, user.subscriptionStatus) ? user.subscriptionPlan : null;

  return (
    <Suspense>
      <PricingPage currentPlanId={currentPlanId} />
    </Suspense>
  );
}
