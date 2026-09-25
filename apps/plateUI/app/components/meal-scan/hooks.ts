'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';
import { MEAL_SCAN_MEAL } from './constants';
import { resolveMealScanLabels } from './utils';
import type { MealScanDetection, MealScanLabelLayout, MealScanLabelSizes } from './types';

const CHIP_SELECTOR = '[data-callout-label]';

const EMPTY_LAYOUT: MealScanLabelLayout = { LABELS: {}, SIZES: {} };

export function useMealScanLabelLayout(
  layerRef: RefObject<HTMLElement | null>,
  detections: readonly MealScanDetection[],
): MealScanLabelLayout {
  const [layout, setLayout] = useState<MealScanLabelLayout>(EMPTY_LAYOUT);

  const measure = useCallback((): MealScanLabelLayout | null => {
    const layer = layerRef.current;

    if (!layer || layer.offsetWidth === 0 || layer.offsetHeight === 0) {
      return null;
    }

    const scaleX = MEAL_SCAN_MEAL.WIDTH / layer.offsetWidth;
    const scaleY = MEAL_SCAN_MEAL.HEIGHT / layer.offsetHeight;
    const sizes: Record<string, { WIDTH: number; HEIGHT: number }> = {};

    for (const detection of detections) {
      const chip = layer.querySelector<HTMLElement>(
        `${CHIP_SELECTOR}[data-callout-label="${detection.KEY}"]`,
      );

      if (!chip || chip.offsetWidth === 0 || chip.offsetHeight === 0) {
        return null;
      }

      sizes[detection.KEY] = {
        WIDTH: chip.offsetWidth * scaleX,
        HEIGHT: chip.offsetHeight * scaleY,
      };
    }

    return {
      LABELS: resolveMealScanLabels(detections, sizes as MealScanLabelSizes),
      SIZES: sizes as MealScanLabelSizes,
    };
  }, [detections, layerRef]);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    const initial = measure();

    if (!initial) {
      return;
    }

    setLayout(initial);

    if (!layer) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const updated = measure();

      if (updated) {
        setLayout(updated);
      }
    });

    observer.observe(layer);

    for (const chip of layer.querySelectorAll(CHIP_SELECTOR)) {
      observer.observe(chip);
    }

    return () => observer.disconnect();
  }, [measure, layerRef]);

  return layout;
}
