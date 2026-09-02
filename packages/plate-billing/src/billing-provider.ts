import type { BillingProvider } from '@/types.js';
import { createLemonSqueezyProvider } from '@/lemonsqueezy/provider.js';
import type { LemonSqueezyProviderConfig } from '@/lemonsqueezy/provider.js';

export type BillingProviderConfig = LemonSqueezyProviderConfig;

export function createBillingProvider(config: BillingProviderConfig): BillingProvider {
  if (config.id !== 'lemonsqueezy') {
    throw new Error('Unsupported billing provider.');
  }

  return createLemonSqueezyProvider(config);
}
