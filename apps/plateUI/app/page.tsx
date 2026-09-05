import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { isActivePaidPlan } from '@plate/plate-billing/utils';
import { getAuthSession } from '@/app/api/auth/utils';
import Contact from '@/app/components/contact';
import Faq from '@/app/components/faq';
import FeedbackMarquee from '@/app/components/feedback-marquee';
import Features from '@/app/components/features';
import Hero from '@/app/components/hero';
import HowItWorks from '@/app/components/how-it-works';
import Pricing from '@/app/components/pricing';
import SiteFooter from '@/app/components/site-footer';
import UseCases from '@/app/components/use-cases';

export default async function Page(): Promise<ReactNode> {
  const session = await getAuthSession((await headers()).get('cookie'));
  const currentPlanId =
    session && isActivePaidPlan(session.subscriptionPlan, session.subscriptionStatus)
      ? session.subscriptionPlan
      : null;

  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <UseCases />
      <FeedbackMarquee />
      <Pricing currentPlanId={currentPlanId} />
      <Faq />
      <Contact />
      <SiteFooter />
    </>
  );
}
