import type { LucideIcon } from 'lucide-react';

export type FeatureTileRow = Readonly<{
  KEY: string;
  ICON: LucideIcon;
  TITLE: string;
  BODY: string;
  ICON_SHELL: string;
  BORDER: string;
  SPAN: string;
  TILE_SHELL: string;
  FEATURED: boolean;
}>;

export type FeatureTileProps = Readonly<{
  tile: FeatureTileRow;
}>;
