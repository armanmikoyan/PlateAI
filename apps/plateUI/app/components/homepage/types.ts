import type { RefObject } from 'react';

export type HomepageMazeEdge = {
  nearX: number;
  nearY: number;
  farX: number;
  farY: number;
  nearDistance: number;
  farDistance: number;
};

export type HomepageMazeParams = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  reduceMotion: boolean;
  cellPx: number;
};
