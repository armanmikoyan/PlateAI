import type { CSSProperties } from 'react';
import { MEAL_SCAN_MEAL, MEAL_SCAN_TIMING } from './constants';
import type {
  MealScanDetection,
  MealScanLabelPoint,
  MealScanLabelSide,
  MealScanLabelSize,
  MealScanLabelSizes,
  MealScanStatus,
} from './types';

const LEADER_LABEL_GAP = 0;
const LEADER_RETICLE_GAP = 3;

const SIDE_DISTANCES = [95, 135, 175, 215, 265, 325, 395, 470] as const;
const LATERAL_SLIDES = [0, 1, -1, 2, -2, 3, -3] as const;
const OVERLAP_PADDING = 14;
const BOUNDS_PADDING = 16;
const OVERLAP_WEIGHT = 6000;
const LATERAL_WEIGHT = 9;
const DISTANCE_WEIGHT = 1;
const CLAMP_WEIGHT = 4;

type Box = MealScanLabelPoint & MealScanLabelSize & { KEY: string };

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getOverlapArea(candidate: Box, obstacles: readonly Box[]): number {
  let total = 0;

  for (const obstacle of obstacles) {
    const overlapX =
      (candidate.WIDTH + obstacle.WIDTH) / 2 + OVERLAP_PADDING - Math.abs(candidate.X - obstacle.X);
    const overlapY =
      (candidate.HEIGHT + obstacle.HEIGHT) / 2 + OVERLAP_PADDING - Math.abs(candidate.Y - obstacle.Y);

    if (overlapX > 0 && overlapY > 0) {
      total += overlapX * overlapY;
    }
  }

  return total;
}

function getObstacle(detection: MealScanDetection): Box {
  const size = MEAL_SCAN_MEAL.RETICLE_RADIUS * 2 + 18;

  return {
    KEY: detection.KEY,
    X: detection.TARGET_X,
    Y: detection.TARGET_Y,
    WIDTH: size,
    HEIGHT: size,
  };
}

function getSlideRange(size: MealScanLabelSize): number {
  return Math.max(size.WIDTH, size.HEIGHT) / 2;
}

function getSideCandidate(
  detection: MealScanDetection,
  side: MealScanLabelSide,
  distance: number,
  slide: number,
  size: MealScanLabelSize,
): Box {
  const lateral = getSlideRange(size) * slide;
  const minX = size.WIDTH / 2 + BOUNDS_PADDING;
  const maxX = MEAL_SCAN_MEAL.WIDTH - size.WIDTH / 2 - BOUNDS_PADDING;
  const minY = size.HEIGHT / 2 + BOUNDS_PADDING;
  const maxY = MEAL_SCAN_MEAL.HEIGHT - size.HEIGHT / 2 - BOUNDS_PADDING;

  const rawX =
    side === 'left'
      ? detection.TARGET_X - distance
      : side === 'right'
        ? detection.TARGET_X + distance
        : detection.TARGET_X + lateral;
  const rawY =
    side === 'top'
      ? detection.TARGET_Y - distance
      : side === 'bottom'
        ? detection.TARGET_Y + distance
        : detection.TARGET_Y + lateral;

  return {
    KEY: detection.KEY,
    X: clamp(rawX, minX, maxX),
    Y: clamp(rawY, minY, maxY),
    WIDTH: size.WIDTH,
    HEIGHT: size.HEIGHT,
  };
}

export function resolveMealScanLabels(
  detections: readonly MealScanDetection[],
  sizes: MealScanLabelSizes,
): Record<string, MealScanLabelPoint> {
  const obstacles: Box[] = detections.map(getObstacle);
  const placed: Record<string, Box> = {};

  for (const detection of detections) {
    const size = sizes[detection.KEY] ?? { WIDTH: 200, HEIGHT: 44 };
    let best: Box | null = null;
    let bestScore = Number.POSITIVE_INFINITY;

    for (const distance of SIDE_DISTANCES) {
      for (const slide of LATERAL_SLIDES) {
        const candidate = getSideCandidate(detection, detection.SIDE, distance, slide, size);
        const clampedX = Math.abs(candidate.X - detection.TARGET_X);
        const clampedY = Math.abs(candidate.Y - detection.TARGET_Y);
        const expectedX =
          detection.SIDE === 'left' || detection.SIDE === 'right'
            ? distance
            : Math.abs(candidate.X - detection.TARGET_X);
        const expectedY =
          detection.SIDE === 'top' || detection.SIDE === 'bottom'
            ? distance
            : Math.abs(candidate.Y - detection.TARGET_Y);
        const drift = Math.hypot(clampedX - expectedX, clampedY - expectedY);

        const score =
          getOverlapArea(candidate, obstacles) * OVERLAP_WEIGHT +
          Math.abs(slide) * LATERAL_WEIGHT +
          distance * DISTANCE_WEIGHT +
          drift * CLAMP_WEIGHT;

        if (score < bestScore) {
          bestScore = score;
          best = candidate;
        }
      }
    }

    if (best) {
      placed[detection.KEY] = best;
      obstacles.push(best);
    }
  }

  return Object.fromEntries(Object.entries(placed).map(([key, box]) => [key, { X: box.X, Y: box.Y }]));
}

export function getMealScanImageRect(): CSSProperties {
  const frameAspect = MEAL_SCAN_MEAL.FRAME_ASPECT;
  const imageAspect = MEAL_SCAN_MEAL.WIDTH / MEAL_SCAN_MEAL.HEIGHT;

  const widthFraction = frameAspect > imageAspect ? imageAspect / frameAspect : 1;
  const heightFraction = frameAspect > imageAspect ? 1 : frameAspect / imageAspect;

  return {
    left: `${((1 - widthFraction) / 2) * 100}%`,
    top: `${((1 - heightFraction) / 2) * 100}%`,
    width: `${widthFraction * 100}%`,
    height: `${heightFraction * 100}%`,
  };
}

export function getMealScanLeaderPath(
  detection: MealScanDetection,
  point: MealScanLabelPoint,
  size: MealScanLabelSize,
): string {
  const dx = detection.TARGET_X - point.X;
  const dy = detection.TARGET_Y - point.Y;
  const length = Math.hypot(dx, dy) || 1;
  const unitX = dx / length;
  const unitY = dy / length;

  const halfWidth = size.WIDTH / 2 + LEADER_LABEL_GAP;
  const halfHeight = size.HEIGHT / 2 + LEADER_LABEL_GAP;
  const edgeX = unitX === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(unitX);
  const edgeY = unitY === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(unitY);
  const edge = Math.min(edgeX, edgeY);

  const endOffset = Math.min(MEAL_SCAN_MEAL.RETICLE_RADIUS + LEADER_RETICLE_GAP, length / 2);
  const startOffset = Math.min(edge, Math.max(length - endOffset, 0));

  const startX = point.X + unitX * startOffset;
  const startY = point.Y + unitY * startOffset;
  const endX = detection.TARGET_X - unitX * endOffset;
  const endY = detection.TARGET_Y - unitY * endOffset;
  const round = (value: number) => Math.round(value * 10) / 10;

  return `M ${round(startX)} ${round(startY)} L ${round(endX)} ${round(endY)}`;
}

export function getMealScanLabelStyle(color: string): CSSProperties {
  return {
    borderColor: `${color}b3`,
    backgroundColor: `color-mix(in srgb, ${color} 20%, rgb(0 0 0 / 0.82))`,
    color,
    boxShadow: '0 4px 14px rgb(0 0 0 / 0.45)',
  };
}

export function getMealScanRevealDelay(detection: MealScanDetection, status: MealScanStatus): number {
  if (status !== 'running') {
    return 0;
  }

  const beamProgress = detection.TARGET_Y / MEAL_SCAN_MEAL.HEIGHT;
  return beamProgress * MEAL_SCAN_TIMING.SCAN_DURATION_S;
}

export function getMealScanLabelDelay(detection: MealScanDetection, status: MealScanStatus): number {
  return getMealScanRevealDelay(detection, status) + MEAL_SCAN_TIMING.LABEL_LEAD_S;
}

function toPercent(value: number, axis: 'WIDTH' | 'HEIGHT'): string {
  const total = axis === 'WIDTH' ? MEAL_SCAN_MEAL.WIDTH : MEAL_SCAN_MEAL.HEIGHT;
  return `${(value / total) * 100}%`;
}

export function getMealScanLabelPosition(x: number, y: number): CSSProperties {
  return {
    left: toPercent(x, 'WIDTH'),
    top: toPercent(y, 'HEIGHT'),
    translate: '-50% -50%',
  };
}
