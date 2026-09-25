import type { LucideIcon } from 'lucide-react';

export type UseCaseCardRow = Readonly<{
  KEY: string;
  ICON: LucideIcon;
  KICKER: string;
  TITLE: string;
  BODY: string;
  ICON_SHELL: string;
  ACCENT_TEXT: string;
  ACCENT_HEX: string;
}>;

export type UseCaseCardProps = Readonly<{
  card: UseCaseCardRow;
}>;
