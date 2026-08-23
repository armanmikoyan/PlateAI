'use client';

import { useAtomValue } from 'jotai';
import { useDeviceType } from '@/lib/device-detection/use-device-type';
import { cn } from '@/lib/utils';
import { SNAP, SNAP_HEADING_PHASE } from './constants';
import { snapAnalysisAtom, snapPhotoAtom } from './state';
import type { SnapHeaderProps } from './types';
import { snapHeadingCopy } from './utils';

export function SnapHeader({ className }: SnapHeaderProps) {
  const photo = useAtomValue(snapPhotoAtom);
  const analysisState = useAtomValue(snapAnalysisAtom);
  const deviceType = useDeviceType();
  const heading = snapHeadingCopy(photo, analysisState, deviceType);

  return (
    <header className={cn(SNAP.HEADING_SHELL, className)}>
      <h1 className="text-content font-heading text-3xl font-semibold tracking-tight duration-500 ease-out sm:text-4xl">
        {heading.TITLE}
      </h1>
      <p
        className={cn(
          'text-content-muted mt-3 max-w-2xl text-base/relaxed sm:text-lg',
          heading.PHASE === SNAP_HEADING_PHASE.LOADING && 'motion-safe:animate-pulse',
        )}
      >
        {heading.SUBTITLE}
      </p>
    </header>
  );
}
