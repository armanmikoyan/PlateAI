import type { ReactNode } from 'react';

import Faq from '@/app/components/faq';
import FeedbackMarquee from '@/app/components/feedback-marquee';
import Features from '@/app/components/features';
import Hero from '@/app/components/hero';
import HowItWorks from '@/app/components/how-it-works';
import Pricing from '@/app/components/pricing';
import SiteFooter from '@/app/components/site-footer';
import UseCases from '@/app/components/use-cases';

export default function Page(): ReactNode {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <UseCases />
      <FeedbackMarquee />
      <Pricing />
      <Faq />
      <SiteFooter />
    </>
  );
}
