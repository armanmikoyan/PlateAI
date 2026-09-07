import type { ReactNode } from 'react';

export type ScrollEnterRow = Readonly<{
  /** Stable key for list reconciliation (defaults to index). */
  KEY?: string;
  content: ReactNode;
  /** Extra classes when visible (e.g. `motion-safe:delay-150`). */
  delayClass?: string;
}>;
