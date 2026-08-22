'use client';

import { Activity, Menu } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/app/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/ui/sheet';

import { NAV } from './constants';
import { NavBarAuth } from './nav-bar-auth';
import { NavBarSectionLinks } from './nav-bar-section-links';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface-raised/85 sticky top-0 z-50 shrink-0 border-b border-edge backdrop-blur-sm">
      <nav className="layout-page-shell flex h-20 items-center gap-3 sm:gap-4" aria-label="Main">
        <div className="flex min-w-0 flex-1 justify-start">
          <Link
            href="/"
            className="text-content hover:opacity-90 flex min-w-0 items-center gap-2 text-2xl font-medium transition-opacity sm:text-3xl"
            onClick={() => setMenuOpen(false)}
          >
            <Activity
              className="text-content motion-safe:animate-pulse size-9 shrink-0 sm:size-10"
              strokeWidth={2}
              aria-hidden
            />
            <span className="text-content" aria-hidden>
              {NAV.SEPARATOR}
            </span>
            <span className="tracking-tight">{NAV.BRAND}</span>
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <NavBarAuth />
          <div className="text-content-muted hidden shrink-0 flex-wrap items-center justify-end gap-x-5 gap-y-2 text-sm font-medium sm:gap-x-8 sm:text-base lg:flex">
            <NavBarSectionLinks variant="desktop" />
          </div>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              aria-label={menuOpen ? NAV.MENU_CLOSE : NAV.MENU_OPEN}
              render={<Button className="lg:hidden" size="icon" variant="outline" />}
            >
              <Menu />
            </SheetTrigger>
            <SheetContent className="lg:hidden" side="left">
              <SheetHeader>
                <SheetTitle>{NAV.MENU_HEADING}</SheetTitle>
              </SheetHeader>
              <div className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-4 pb-4">
                <NavBarSectionLinks onAfterNavigate={() => setMenuOpen(false)} variant="drawer" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
