import type { LucideIcon } from 'lucide-react';

export type HowItWorksStepRow = Readonly<{
  KEY: string;
  ICON: LucideIcon;
  TITLE: string;
  BODY: string;
  ICON_SHELL: string;
}>;
