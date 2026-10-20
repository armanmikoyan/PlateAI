'use client';

import { useEffect } from 'react';
import { hapticTap } from '@/app/utils/haptics';

const INTERACTIVE_SELECTOR =
  'button, a[href], [role="button"], [role="tab"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]';

export function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const element = target.closest(INTERACTIVE_SELECTOR);

  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
    return false;
  }

  return true;
}

export function WireGlobalHaptics() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isInteractiveTarget(event.target) === false) {
        return;
      }

      hapticTap();
    };

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
}
