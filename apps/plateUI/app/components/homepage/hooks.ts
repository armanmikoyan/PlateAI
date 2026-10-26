'use client';

import { useEffect } from 'react';
import { HOMEPAGE_BG_MAZE } from './constants';
import type { HomepageMazeEdge, HomepageMazeParams } from './types';

function createEdges(width: number, height: number, cellPx: number): HomepageMazeEdge[] {
  const centerX = width / 2;
  const centerY = height / 2;
  const startCol = -Math.ceil(centerX / cellPx);
  const endCol = Math.ceil((width - centerX) / cellPx);
  const startRow = -Math.ceil(centerY / cellPx);
  const endRow = Math.ceil((height - centerY) / cellPx);
  const edges: HomepageMazeEdge[] = [];

  const addEdge = (x1: number, y1: number, x2: number, y2: number): void => {
    const firstDistance = Math.hypot(x1 - centerX, y1 - centerY);
    const secondDistance = Math.hypot(x2 - centerX, y2 - centerY);

    if (firstDistance <= secondDistance) {
      edges.push({
        nearX: x1,
        nearY: y1,
        farX: x2,
        farY: y2,
        nearDistance: firstDistance,
        farDistance: secondDistance,
      });
    } else {
      edges.push({
        nearX: x2,
        nearY: y2,
        farX: x1,
        farY: y1,
        nearDistance: secondDistance,
        farDistance: firstDistance,
      });
    }
  };

  for (let row = startRow; row <= endRow; row += 1) {
    const y = centerY + row * cellPx;

    for (let col = startCol; col < endCol; col += 1) {
      const x = centerX + col * cellPx;
      addEdge(x, y, x + cellPx, y);
    }
  }

  for (let row = startRow; row < endRow; row += 1) {
    const y = centerY + row * cellPx;

    for (let col = startCol; col <= endCol; col += 1) {
      const x = centerX + col * cellPx;
      addEdge(x, y, x, y + cellPx);
    }
  }

  return edges.sort((first, second) => first.farDistance - second.farDistance);
}

export function useHomepageMaze({ canvasRef, reduceMotion, cellPx }: HomepageMazeParams): void {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context || reduceMotion) {
      return;
    }

    const trailCanvas = document.createElement('canvas');
    const trailContext = trailCanvas.getContext('2d');

    if (!trailContext) {
      return;
    }

    let animationFrame = 0;
    let resizeTimer = 0;
    let width = 0;
    let height = 0;
    let edges: HomepageMazeEdge[] = [];
    let maxDistance = 0;
    let completedIndex = 0;
    let elapsed = 0;
    let lastTime = 0;
    let running = true;

    const strokeSegment = (
      target: CanvasRenderingContext2D,
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      color: string,
      lineCap: CanvasLineCap,
    ): void => {
      target.strokeStyle = color;
      target.lineWidth = HOMEPAGE_BG_MAZE.LINE_WIDTH_PX;
      target.lineCap = lineCap;
      target.beginPath();
      target.moveTo(startX, startY);
      target.lineTo(endX, endY);
      target.stroke();
    };

    const drawFrame = (radius: number): void => {
      context.clearRect(0, 0, width, height);
      context.drawImage(trailCanvas, 0, 0, width, height);

      for (const edge of edges) {
        if (edge.nearDistance < radius && edge.farDistance > radius) {
          const span = edge.farDistance - edge.nearDistance;
          const fraction = span > 0 ? (radius - edge.nearDistance) / span : 1;

          strokeSegment(
            context,
            edge.nearX,
            edge.nearY,
            edge.nearX + (edge.farX - edge.nearX) * fraction,
            edge.nearY + (edge.farY - edge.nearY) * fraction,
            HOMEPAGE_BG_MAZE.ACTIVE_COLOR,
            'round',
          );
        }
      }
    };

    const loop = (time: number): void => {
      if (!running) {
        return;
      }

      const delta =
        lastTime === 0 ? 0 : Math.min((time - lastTime) / 1000, HOMEPAGE_BG_MAZE.MAX_FRAME_STEP_S);
      lastTime = time;
      elapsed += delta;

      const progress = maxDistance === 0 ? 1 : Math.min(elapsed / HOMEPAGE_BG_MAZE.SPREAD_DURATION_S, 1);
      const radius = progress * maxDistance;

      while (completedIndex < edges.length) {
        const edge = edges[completedIndex];

        if (!edge || edge.farDistance > radius) {
          break;
        }

        strokeSegment(
          trailContext,
          edge.nearX,
          edge.nearY,
          edge.farX,
          edge.farY,
          HOMEPAGE_BG_MAZE.TRAIL_COLOR,
          'butt',
        );
        completedIndex += 1;
      }

      drawFrame(radius);

      if (progress >= 1) {
        running = false;
        return;
      }

      animationFrame = requestAnimationFrame(loop);
    };

    const reset = (): void => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, HOMEPAGE_BG_MAZE.DPR_CAP);

      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      trailCanvas.width = canvas.width;
      trailCanvas.height = canvas.height;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      trailContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      trailContext.clearRect(0, 0, width, height);

      edges = createEdges(width, height, cellPx);
      maxDistance = edges[edges.length - 1]?.farDistance ?? 0;
      completedIndex = 0;
      elapsed = 0;
      lastTime = 0;
      running = true;

      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(loop);
    };

    const handleResize = (): void => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(reset, HOMEPAGE_BG_MAZE.RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize);
    reset();

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, cellPx, reduceMotion]);
}
