'use client';

import { useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import {
  SCAN_OVERLAY,
  SCAN_OVERLAY_GRID_CLASS,
  SCAN_OVERLAY_GRID_MASK_CLASS,
} from '@/app/components/scan-overlay/constants';
import {
  HOMEPAGE_BG_GLOW_CLASS,
  HOMEPAGE_BG_GRID_WRAPPER_CLASS,
  HOMEPAGE_BG_MAZE_CANVAS_CLASS,
  HOMEPAGE_BG_SHELL_CLASS,
  HOMEPAGE_BG_VIGNETTE_CLASS,
} from './constants';
import { useHomepageMaze } from './hooks';

export default function HomepageBackground() {
  const reduceMotion = useReducedMotion() === true;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cell = SCAN_OVERLAY.GRID_SIZE_PX;
  const gridSize = `${cell}px ${cell}px`;

  useHomepageMaze({ canvasRef, reduceMotion, cellPx: cell });

  return (
    <div aria-hidden className={HOMEPAGE_BG_SHELL_CLASS}>
      <div className={HOMEPAGE_BG_GLOW_CLASS} />

      <div className={HOMEPAGE_BG_GRID_WRAPPER_CLASS}>
        <div className={SCAN_OVERLAY_GRID_MASK_CLASS}>
          <div
            className={SCAN_OVERLAY_GRID_CLASS}
            style={{
              inset: -cell,
              backgroundSize: gridSize,
              backgroundPosition: `calc(50% + ${cell / 2}px) calc(50% + ${cell / 2}px)`,
            }}
          />
        </div>
      </div>

      {reduceMotion ? null : (
        <div className={SCAN_OVERLAY_GRID_MASK_CLASS}>
          <canvas ref={canvasRef} className={HOMEPAGE_BG_MAZE_CANVAS_CLASS} />
        </div>
      )}

      <div className={HOMEPAGE_BG_VIGNETTE_CLASS} />
    </div>
  );
}
