export type MealScanLabelSize = Readonly<{
  WIDTH: number;
  HEIGHT: number;
}>;

export type MealScanLabelPoint = Readonly<{
  X: number;
  Y: number;
}>;

export type MealScanLabelSide = 'top' | 'right' | 'bottom' | 'left';

export type MealScanLabelSizes = Readonly<Record<string, MealScanLabelSize>>;

export type MealScanLabelLayout = Readonly<{
  LABELS: Readonly<Record<string, MealScanLabelPoint>>;
  SIZES: MealScanLabelSizes;
}>;

export type MealScanStatus = 'idle' | 'running' | 'complete';

export type MealScanDetection = Readonly<{
  KEY: string;
  LABEL: string;
  DETAIL: string;
  COLOR: string;
  SIDE: MealScanLabelSide;
  TARGET_X: number;
  TARGET_Y: number;
}>;

export type MealScanVisualProps = Readonly<{
  detections: readonly MealScanDetection[];
  status: MealScanStatus;
  runId: number;
  reduceMotion: boolean;
  onScanComplete: () => void;
  className?: string;
}>;

export type MealScanCalloutProps = Readonly<{
  detection: MealScanDetection;
  solvedPoint: MealScanLabelPoint | null;
  size: MealScanLabelSize | null;
  revealDelay: number;
  labelDelay: number;
  visible: boolean;
  isComplete: boolean;
  reduceMotion: boolean;
  runId: number;
}>;

export type MealScanResultPanelProps = Readonly<{
  detections: readonly MealScanDetection[];
  status: MealScanStatus;
  runId: number;
}>;
