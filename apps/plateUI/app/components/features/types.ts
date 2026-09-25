import type { LucideIcon } from 'lucide-react';

export type FeatureDemoSceneKey = 'photo' | 'context' | 'progress' | 'profiles';

export type FeatureDemoRow = Readonly<{
  KEY: FeatureDemoSceneKey;
  ICON: LucideIcon;
  TITLE: string;
  BODY: string;
  ACCENT_TEXT: string;
  ACCENT_SHELL: string;
  ACCENT_HEX: string;
}>;

export type FeatureDemoPhotoChip = Readonly<{
  LABEL: string;
  VALUE: string;
}>;

export type FeatureDemoContextBar = Readonly<{
  KEY: string;
  LABEL: string;
  VALUE: string;
  PCT: number;
  COLOR: string;
}>;

export type FeatureDemoProgressDay = Readonly<{
  KEY: string;
  DAY: string;
  LOGGED: boolean;
}>;

export type FeatureDemoProfileTarget = Readonly<{
  KEY: string;
  LABEL: string;
  VALUE: string;
}>;

export type FeatureDemoTabsProps = Readonly<{
  rows: readonly FeatureDemoRow[];
  activeKey: FeatureDemoSceneKey;
  onSelect: (key: FeatureDemoSceneKey) => void;
}>;

export type FeatureDemoPreviewProps = Readonly<{
  rows: readonly FeatureDemoRow[];
  activeKey: FeatureDemoSceneKey;
  reduceMotion: boolean;
}>;

export type FeatureDemoSceneProps = Readonly<{
  reduceMotion: boolean;
}>;

export type FeatureDemoSceneSwitchProps = Readonly<{
  sceneKey: FeatureDemoSceneKey;
  reduceMotion: boolean;
}>;
