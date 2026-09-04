import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Privacy from '@/app/components/privacy';

export const metadata: Metadata = {
  title: 'Privacy Policy · PlateAI',
  description: 'How PlateAI collects, uses, and protects your personal data.',
};

export default function PrivacyPage(): ReactNode {
  return <Privacy />;
}
