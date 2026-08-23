import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { MEAL_HISTORY } from '@/app/components/meal-history/constants';
import MealHistory from '@/app/components/meal-history';

export const metadata: Metadata = {
  title: 'Meal analyses · PlateAI',
  description: MEAL_HISTORY.SUBTITLE,
};

export default function Page(): ReactNode {
  return (
    <section className="border-edge/60 flex flex-1 flex-col border-b bg-canvas py-8 sm:py-10 lg:py-12">
      <div className="layout-page-shell flex flex-1 flex-col gap-6">
        <header className="max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            {MEAL_HISTORY.TITLE}
          </h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">{MEAL_HISTORY.SUBTITLE}</p>
        </header>
        <MealHistory />
      </div>
    </section>
  );
}
