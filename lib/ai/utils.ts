import { AiConfigError } from '@/lib/ai/errors';
import { MEAL_IMAGE_ANALYSIS_TEST_DELAY_MS } from '@/lib/ai/constants';
import type { ImageAnalysisProviderConfig, ImageAnalysisProviderId } from '@/lib/ai/types';

const DEFAULT_MODELS: Readonly<Record<ImageAnalysisProviderId, string>> = {
  gemini: 'gemini-3.6-flash',
  openai: 'gpt-4o-mini',
};

function parseProvider(value: string | undefined): ImageAnalysisProviderId {
  const normalized = value?.trim().toLowerCase();

  if (normalized === 'gemini' || normalized === 'openai') {
    return normalized;
  }

  throw new AiConfigError(
    'AI_IMAGE_PROVIDER must be set to "gemini" or "openai" (e.g. AI_IMAGE_PROVIDER=gemini).',
  );
}

export function readImageAnalysisTestMode(env: NodeJS.ProcessEnv = process.env): boolean {
  const value = env.AI_TEST_MODE?.trim().toLowerCase();
  return value === 'true' || value === '1';
}

export function readImageAnalysisTestDelayMs(): number {
  const { MIN, MAX } = MEAL_IMAGE_ANALYSIS_TEST_DELAY_MS;
  return MIN + Math.floor(Math.random() * (MAX - MIN + 1));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function imageMimeForAnalysis(file: Pick<File, 'name' | 'type'>): string {
  const type = file.type.trim().toLowerCase();

  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp') {
    return type;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'png') {
    return 'image/png';
  }

  if (extension === 'webp') {
    return 'image/webp';
  }

  return 'image/jpeg';
}

export function readImageAnalysisProviderConfig(
  env: NodeJS.ProcessEnv = process.env,
): ImageAnalysisProviderConfig {
  const provider = parseProvider(env.AI_IMAGE_PROVIDER);
  const apiKey = env.AI_PROVIDER_API_KEY?.trim();

  if (!apiKey) {
    throw new AiConfigError('AI_PROVIDER_API_KEY is required for meal image analysis.');
  }

  const model = env.AI_IMAGE_MODEL?.trim() || DEFAULT_MODELS[provider];

  return {
    provider,
    apiKey,
    model,
  };
}
