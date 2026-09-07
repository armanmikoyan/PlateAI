import type { BillingProvider, BillingProviderConfig } from '@/types.js';
import { createLemonSqueezyProvider } from '@/lemonsqueezy/provider.js';

export type { BillingProviderConfig } from '@/types.js';

export function createBillingProvider(config: BillingProviderConfig): BillingProvider {
  if (config.id !== 'lemonsqueezy') {
    throw new Error('Unsupported billing provider.');
  }

  return createLemonSqueezyProvider(config);
}
