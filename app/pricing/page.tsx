import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Suspense } from 'react';

import { PRICING_PAGE } from '@/app/components/pricing/constants';
import PricingPage from '@/app/components/pricing/pricing-page';

export const metadata: Metadata = {
  title: 'Pricing · PlateAI',
  description: PRICING_PAGE.SUBTITLE,
};

export default function Page(): ReactNode {
  return (
    <Suspense>
      <PricingPage />
    </Suspense>
  );
}
