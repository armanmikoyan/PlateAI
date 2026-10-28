'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { HOMEPAGE_CURSOR_CELL_CLASS } from './constants';
import type { HomepageClickSquare, HomepageCursorParams } from './types';

export function HomepageCursor({ cellPx }: HomepageCursorParams) {
  const [clickSquares, setClickSquares] = useState<HomepageClickSquare[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      const centerX = document.documentElement.clientWidth / 2;
      const centerY = document.documentElement.clientHeight / 2;
      const left = centerX + Math.floor((event.clientX - centerX) / cellPx) * cellPx;
      const top = centerY + Math.floor((event.clientY - centerY) / cellPx) * cellPx;
      const id = idRef.current++;

      setClickSquares((previous) => [...previous, { id, x: left, y: top }]);
      window.setTimeout(() => {
        setClickSquares((previous) => previous.filter((square) => square.id !== id));
      }, 3000);
    };

    window.addEventListener('click', handleClick);

    return () => window.removeEventListener('click', handleClick);
  }, [cellPx]);

  return (
    <AnimatePresence>
      {clickSquares.map((square) => (
        <motion.div
          key={square.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={HOMEPAGE_CURSOR_CELL_CLASS}
          style={{ left: square.x, top: square.y, width: cellPx + 1, height: cellPx + 1 }}
        />
      ))}
    </AnimatePresence>
  );
}
