import { cn } from '@/app/utils/cn';
import { HERO_ENTER_MOTION_REDUCE, HERO_ENTER_SHELL_BLOCKS } from './constants';
import { HeroCta } from './hero-cta';
import { HeroIntro } from './hero-intro';
import { HeroMealStage } from './hero-meal-stage';
import { HeroSpotlight } from './hero-spotlight';

export default function Hero() {
  return (
    <section className="relative overflow-x-clip" aria-labelledby="hero-heading">
      <HeroSpotlight />
      <div className="relative layout-page-shell py-8 sm:py-10 lg:py-12">
        {HERO_ENTER_SHELL_BLOCKS.map(({ ID, SHELL }) => (
          <div key={ID} className={cn(SHELL, HERO_ENTER_MOTION_REDUCE)}>
            {ID === 'intro' ? (
              <>
                <HeroIntro />
                <HeroCta />
              </>
            ) : (
              <HeroMealStage />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
