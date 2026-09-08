import type { LucideIcon } from 'lucide-react';

export type HowItWorksStepRow = Readonly<{
  KEY: string;
  STEP: string;
  ICON: LucideIcon;
  TITLE: string;
  BODY: string;
  ICON_SHELL: string;
  NODE_SHELL: string;
}>;

export type HowItWorksStepProps = Readonly<{
  step: HowItWorksStepRow;
}>;
