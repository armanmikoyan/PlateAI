'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import Image from 'next/image';
import { Settings2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/app/ui/button';
import { Card } from '@/app/ui/card';
import { cn } from '@/app/utils/cn';
import {
  SNAP,
  SNAP_MOTION_REDUCED,
  SNAP_PHOTO_CARD_SHELL,
  SNAP_STAGE_ENTRANCE_CLASS,
  SNAP_STAGE_SPRING,
} from './constants';
import { SnapPhotoActions } from './snap-photo-actions';
import type { SnapMealPhotoCardProps } from './types';
export function SnapMealPhotoCard({
  previewUrl,
  photoActions,
  photoActionsDisabled = false,
}: SnapMealPhotoCardProps) {
  const [actionsOpen, setActionsOpen] = useState(false);
  const reduceMotion = useReducedMotion() === true;
  const showSettings = Boolean(photoActions) && !photoActionsDisabled;

  useEffect(() => {
    if (!actionsOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActionsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actionsOpen]);

  function handleBackdropClick() {
    setActionsOpen(false);
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  function closeActions() {
    setActionsOpen(false);
  }

  return (
    <motion.div
      className={SNAP_STAGE_ENTRANCE_CLASS}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduceMotion ? SNAP_MOTION_REDUCED : SNAP_STAGE_SPRING}
    >
      <Card className={cn('h-full', SNAP_PHOTO_CARD_SHELL)}>
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={previewUrl}
            alt={SNAP.PREVIEW_ALT}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {showSettings ? (
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-3 left-3 z-10"
              aria-expanded={actionsOpen}
              aria-controls="snap-photo-actions"
              aria-label={SNAP.PHOTO_SETTINGS_LABEL}
              onClick={() => setActionsOpen((open) => !open)}
            >
              <Settings2 aria-hidden />
            </Button>
          ) : null}
          {showSettings && actionsOpen && photoActions ? (
            <div
              className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
              onClick={handleBackdropClick}
            >
              <div id="snap-photo-actions" onClick={handleOverlayClick}>
                <SnapPhotoActions
                  disabled={photoActionsDisabled}
                  onReplace={() => {
                    closeActions();
                    photoActions.onReplace();
                  }}
                  onCamera={() => {
                    closeActions();
                    photoActions.onCamera();
                  }}
                  onRemove={() => {
                    closeActions();
                    photoActions.onRemove();
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}
