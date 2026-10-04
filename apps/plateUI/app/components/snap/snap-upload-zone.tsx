'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { Upload } from 'lucide-react';
import { EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/app/ui/empty';
import { cn } from '@/app/utils/cn';
import {
  SNAP_MOTION_REDUCED,
  SNAP_MOTION_SPRING,
  SNAP_UPLOAD_ANIM,
  SNAP_UPLOAD_RING_CLASS,
  SNAP_UPLOAD_RING_EASE,
  SNAP_UPLOAD_SHINE_CLASS,
  SNAP_UPLOAD_ZONE_ARMED,
  SNAP_UPLOAD_ZONE_ARMED_CLASS,
  SNAP_UPLOAD_ZONE_CLASS,
  SNAP_UPLOAD_ZONE_CONTENT_CLASS,
  SNAP_UPLOAD_ZONE_FRAME_CLASS,
  SNAP_UPLOAD_ZONE_HOVER,
  SNAP_UPLOAD_ZONE_PRESS,
  SNAP_UPLOAD_ZONE_REST,
} from './constants';
import type { SnapUploadZoneGeometry, SnapUploadZoneProps, SnapUploadZoneRing } from './types';

export function SnapUploadZone({
  actions,
  description,
  dragHandlers,
  hint,
  interactive,
  isDragging,
  onClick,
  title,
}: SnapUploadZoneProps) {
  const reduceMotion = useReducedMotion() === true;
  const zoneRef = useRef<HTMLDivElement>(null);
  const ringIdRef = useRef(0);
  const ringTimerRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [ring, setRing] = useState<SnapUploadZoneRing | null>(null);

  const rotateX = useSpring(useMotionValue(0), {
    stiffness: SNAP_UPLOAD_ANIM.TILT_STIFFNESS,
    damping: SNAP_UPLOAD_ANIM.TILT_DAMPING,
  });
  const rotateY = useSpring(useMotionValue(0), {
    stiffness: SNAP_UPLOAD_ANIM.TILT_STIFFNESS,
    damping: SNAP_UPLOAD_ANIM.TILT_DAMPING,
  });

  const armed = isDragging || pressed;

  useEffect(() => {
    return () => {
      window.clearTimeout(ringTimerRef.current);
    };
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const element = zoneRef.current;
      if (!element || reduceMotion || !interactive) {
        return;
      }

      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      rotateY.set((px - 0.5) * 2 * SNAP_UPLOAD_ANIM.MAX_TILT_DEG);
      rotateX.set((0.5 - py) * 2 * SNAP_UPLOAD_ANIM.MAX_TILT_DEG);
    },
    [interactive, reduceMotion, rotateX, rotateY],
  );

  const handlePointerEnter = useCallback(() => {
    if (interactive) {
      setHovered(true);
    }
  }, [interactive]);

  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    setPressed(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  const handlePointerDown = useCallback(() => {
    setPressed(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setPressed(false);
  }, []);

  const handleZoneClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!reduceMotion) {
        const rect = event.currentTarget.getBoundingClientRect();
        ringIdRef.current += 1;
        setRing({
          ID: ringIdRef.current,
          X_PERCENT: ((event.clientX - rect.left) / rect.width) * 100,
          Y_PERCENT: ((event.clientY - rect.top) / rect.height) * 100,
        });
        window.clearTimeout(ringTimerRef.current);
        ringTimerRef.current = window.setTimeout(() => {
          setRing(null);
        }, SNAP_UPLOAD_ANIM.RING_MS);
      }

      onClick(event);
    },
    [onClick, reduceMotion],
  );

  let target: SnapUploadZoneGeometry = SNAP_UPLOAD_ZONE_REST;
  if (hovered) {
    target = SNAP_UPLOAD_ZONE_HOVER;
  }

  if (pressed) {
    target = SNAP_UPLOAD_ZONE_PRESS;
  }

  if (isDragging) {
    target = SNAP_UPLOAD_ZONE_ARMED;
  }

  return (
    <div className={SNAP_UPLOAD_ZONE_FRAME_CLASS}>
      <motion.div
        ref={zoneRef}
        className={cn(
          SNAP_UPLOAD_ZONE_CLASS,
          interactive ? 'cursor-pointer border-4' : 'border',
          armed && SNAP_UPLOAD_ZONE_ARMED_CLASS,
        )}
        initial={false}
        animate={target}
        transition={reduceMotion ? SNAP_MOTION_REDUCED : SNAP_MOTION_SPRING}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onClick={handleZoneClick}
        {...dragHandlers}
      >
        <div aria-hidden className={SNAP_UPLOAD_SHINE_CLASS} />

        <AnimatePresence>
          {ring ? (
            <motion.span
              key={ring.ID}
              aria-hidden
              className={SNAP_UPLOAD_RING_CLASS}
              style={{ left: `${ring.X_PERCENT}%`, top: `${ring.Y_PERCENT}%`, x: '-50%', y: '-50%' }}
              initial={{
                opacity: SNAP_UPLOAD_ANIM.RING_PEAK_OPACITY,
                scale: SNAP_UPLOAD_ANIM.RING_START_SCALE,
              }}
              animate={{ opacity: 0, scale: SNAP_UPLOAD_ANIM.RING_END_SCALE }}
              exit={{ opacity: 0 }}
              transition={
                reduceMotion
                  ? SNAP_MOTION_REDUCED
                  : { duration: SNAP_UPLOAD_ANIM.RING_MS / 1000, ease: SNAP_UPLOAD_RING_EASE }
              }
            />
          ) : null}
        </AnimatePresence>

        <div className={SNAP_UPLOAD_ZONE_CONTENT_CLASS}>
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none"
            >
              <Upload aria-hidden />
            </EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {hint ? <p>{hint}</p> : null}
            {actions}
          </EmptyContent>
        </div>
      </motion.div>
    </div>
  );
}
