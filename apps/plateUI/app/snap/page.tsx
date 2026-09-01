import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Snap from '@/app/components/snap';

export const metadata: Metadata = {
  title: 'Snap a plate · PlateAI',
  description: 'Upload a meal photo.',
};

export default function Page(): ReactNode {
  return <Snap />;
}
