'use client';

import { Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type MouseEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/app/ui/button';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/app/ui/sheet';
import { cn } from '@/app/utils/cn';
import {
  NAV,
  NAV_ACTIONS_CLASS,
  NAV_ACTIONS_CONDENSED_CLASS,
  NAV_AUTH_BAR_SLOT_CLASS,
  NAV_BAR_BASE_CLASS,
  NAV_BAR_CONDENSED,
  NAV_BAR_CONDENSED_CLASS,
  NAV_BAR_REST,
  NAV_MOTION_SPRING,
  NAV_MOTION_REDUCED,
  NAV_DESKTOP_LINKS_CLASS,
  NAV_DRAWER_FOOTER_CLASS,
  NAV_HEADER_CLASS,
  NAV_HEADER_SHELL_CLASS,
  NAV_LOGO_CLASS,
  NAV_LOGO_CONDENSED_CLASS,
  NAV_LOGO_HEIGHT_PX,
  NAV_LOGO_WIDTH_PX,
  NAV_PROGRESS_CLIP_CLASS,
  NAV_PROGRESS_FILL_CLASS,
  NAV_PROGRESS_TRACK_CLASS,
} from './constants';
import { useNavAuthSession, useNavBarCondensed, useNavBarProgressWidth } from './hooks';
import { NavBarAuth } from './nav-bar-auth';
import { NavBarSectionLinks } from './nav-bar-section-links';
import { NavBarSnapCta } from './nav-bar-snap-cta';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  useNavAuthSession();
  const condensed = useNavBarCondensed();

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    setMenuOpen(false);
    // On other routes the link navigates home; on home it returns to the initial position.
    if (pathname !== '/') return;
    event.preventDefault();
    window.scrollTo({ top: 0 });
  }
  const progressWidth = useNavBarProgressWidth();
  const reduceMotion = useReducedMotion();

  return (
    <header className={NAV_HEADER_CLASS}>
      <nav className={NAV_HEADER_SHELL_CLASS} aria-label="Main">
        <motion.div
          initial={false}
          animate={condensed ? NAV_BAR_CONDENSED : NAV_BAR_REST}
          transition={reduceMotion ? NAV_MOTION_REDUCED : NAV_MOTION_SPRING}
          className={cn(NAV_BAR_BASE_CLASS, condensed && NAV_BAR_CONDENSED_CLASS)}
        >
          <div className="flex min-w-0 flex-1 justify-start">
            <Link
              href="/"
              className="text-content hover:opacity-90 flex min-w-0 items-center motion-safe:transition-opacity"
              onClick={handleLogoClick}
            >
              <Image
                src="/icons/logo.png"
                alt="PlateAI Logo"
                width={NAV_LOGO_WIDTH_PX}
                height={NAV_LOGO_HEIGHT_PX}
                className={cn(NAV_LOGO_CLASS, condensed && NAV_LOGO_CONDENSED_CLASS)}
                priority
              />
            </Link>
          </div>

          <div className={cn(NAV_ACTIONS_CLASS, condensed && NAV_ACTIONS_CONDENSED_CLASS)}>
            <div className={NAV_DESKTOP_LINKS_CLASS}>
              <NavBarSectionLinks variant="desktop" />
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <NavBarSnapCta />
              <div className={NAV_AUTH_BAR_SLOT_CLASS}>
                <NavBarAuth variant="bar" />
              </div>
              <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetTrigger
                  aria-label={menuOpen ? NAV.MENU_CLOSE : NAV.MENU_OPEN}
                  render={<Button className="xl:hidden" size="icon" variant="outline" />}
                >
                  <Menu />
                </SheetTrigger>
                <SheetContent className="xl:hidden" side="left">
                  <SheetHeader>
                    <SheetTitle>{NAV.MENU_HEADING}</SheetTitle>
                  </SheetHeader>
                  <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-4 pb-4">
                    <NavBarSectionLinks onAfterNavigate={() => setMenuOpen(false)} variant="drawer" />
                  </div>
                  <SheetFooter className={NAV_DRAWER_FOOTER_CLASS}>
                    <NavBarAuth variant="drawer" />
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div aria-hidden className={cn(NAV_PROGRESS_CLIP_CLASS, !condensed && 'opacity-0')}>
            <div className={NAV_PROGRESS_TRACK_CLASS}>
              <motion.span className={NAV_PROGRESS_FILL_CLASS} style={{ width: progressWidth }} />
            </div>
          </div>
        </motion.div>
      </nav>
    </header>
  );
}
