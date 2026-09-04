import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Terms from '@/app/components/terms';

export const metadata: Metadata = {
  title: 'Terms of Service · PlateAI',
  description: 'The terms that govern your use of PlateAI.',
};

export default function TermsPage(): ReactNode {
  return <Terms />;
}
