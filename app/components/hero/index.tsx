import { cn } from '@/app/utils/cn';
import { HERO_ENTER_MOTION_REDUCE, HERO_ENTER_SHELL_BLOCKS } from './constants';
import { HeroCta } from './hero-cta';
import { HeroIntroTypewriter } from './hero-intro-typewriter';
import { HeroMealStage } from './hero-meal-stage';

export default function Hero() {
  return (
    <section
      className="border-edge/60 relative overflow-x-clip border-b bg-canvas"
      aria-labelledby="hero-heading"
    >
      <div className="relative layout-page-shell py-8 sm:py-10 lg:py-12">
        {HERO_ENTER_SHELL_BLOCKS.map(({ ID, SHELL }) => (
          <div key={ID} className={cn(SHELL, HERO_ENTER_MOTION_REDUCE)}>
            {ID === 'intro' ? (
              <>
                <HeroIntroTypewriter />
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
