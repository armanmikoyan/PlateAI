'use client';

import { AnimatePresence, motion, useMotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { HomepageCursorParams } from './types';

export function HomepageCursor({ cellPx }: HomepageCursorParams) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const [clickSquares, setClickSquares] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const idRef = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handlePointerMove = (event: PointerEvent): void => {
      if (event.pointerType === 'touch') {
        return;
      }
      const { clientX: x, clientY: y } = event;
      pointerX.set(x);
      pointerY.set(y);
    };

    const handleClick = (event: Event): void => {
      const pointerEvent = event as PointerEvent;
      if (pointerEvent.pointerType === 'touch') {
        return;
      }
      const x = pointerEvent.clientX;
      const y = pointerEvent.clientY;
      const centerX = document.documentElement.clientWidth / 2;
      const centerY = document.documentElement.clientHeight / 2;
      const left = centerX + Math.floor((x - centerX) / cellPx) * cellPx;
      const top = centerY + Math.floor((y - centerY) / cellPx) * cellPx;
      const id = idRef.current++;
      setClickSquares((prev) => [...prev, { id, x: left, y: top }]);
      window.setTimeout(() => {
        setClickSquares((prev) => prev.filter((sq) => sq.id !== id));
      }, 3000);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [cellPx, pointerX, pointerY]);

  return (
    <>
      <AnimatePresence>
        {clickSquares.map((sq) => (
          <motion.div
            key={sq.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="pointer-events-none absolute border border-accent/80 bg-accent/10 shadow-[0_0_18px_rgb(251_191_36/0.35),inset_0_0_10px_rgb(251_191_36/0.18)]"
            style={{ left: sq.x, top: sq.y, width: cellPx + 1, height: cellPx + 1 }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
