import { createGeminiImageAnalysisProvider } from '@/providers/gemini.js';
import { createOpenAiImageAnalysisProvider } from '@/providers/openai.js';
import {
  DEFAULT_IMAGE_ANALYSIS_MODELS,
  IMAGE_ANALYSIS_PROVIDER,
  MEAL_ANALYSIS_CONFIDENCE_VALUES,
  MEAL_IMAGE_ANALYSIS_TEST_DELAY_MS,
} from '@/constants.js';
import { AiParseError } from '@/errors.js';
import type {
  ImageAnalysisProvider,
  ImageAnalysisProviderConfig,
  ImageAnalysisProviderId,
  MealAnalysisConfidence,
  MealAnalysisResult,
} from '@/types.js';

function isConfidence(value: unknown): value is MealAnalysisConfidence {
  return typeof value === 'string' && MEAL_ANALYSIS_CONFIDENCE_VALUES.some((entry) => entry === value);
}

function nonNegativeInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new AiParseError(`Invalid ${field} in model response.`);
  }
  return Math.round(value);
}

function nonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AiParseError(`Invalid ${field} in model response.`);
  }
  return value.trim();
}

function optionalNote(value: unknown): string | null {
  if (value == null) {
    return null;
  }
  if (typeof value !== 'string') {
    throw new AiParseError('Invalid notes in model response.');
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function parseMealImageAnalysis(rawText: string): MealAnalysisResult {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(rawText) as Record<string, unknown>;
  } catch {
    throw new AiParseError('Model response was not valid JSON.');
  }

  if (!isConfidence(parsed.confidence)) {
    throw new AiParseError('Invalid confidence in model response.');
  }

  return {
    mealName: nonEmptyString(parsed.mealName, 'mealName'),
    calories: nonNegativeInteger(parsed.calories, 'calories'),
    proteinG: nonNegativeInteger(parsed.proteinG, 'proteinG'),
    carbsG: nonNegativeInteger(parsed.carbsG, 'carbsG'),
    fatG: nonNegativeInteger(parsed.fatG, 'fatG'),
    confidence: parsed.confidence,
    notes: optionalNote(parsed.notes),
  };
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function readImageAnalysisTestDelayMs(): number {
  const { MIN, MAX } = MEAL_IMAGE_ANALYSIS_TEST_DELAY_MS;
  return MIN + Math.floor(Math.random() * (MAX - MIN + 1));
}

function parseProvider(value: string | undefined): ImageAnalysisProviderId {
  const normalized = value?.trim().toLowerCase();
  if (normalized === IMAGE_ANALYSIS_PROVIDER.GEMINI || normalized === IMAGE_ANALYSIS_PROVIDER.OPENAI) {
    return normalized;
  }
  throw new Error('AI_IMAGE_PROVIDER must be set to "gemini" or "openai" (e.g. AI_IMAGE_PROVIDER=gemini).');
}

export function readImageAnalysisProviderConfig(
  env: NodeJS.ProcessEnv = process.env,
): ImageAnalysisProviderConfig {
  const provider = parseProvider(env.AI_IMAGE_PROVIDER);
  const apiKey = env.AI_PROVIDER_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('AI_PROVIDER_API_KEY is required for meal image analysis.');
  }
  const model = env.AI_IMAGE_MODEL?.trim() || DEFAULT_IMAGE_ANALYSIS_MODELS[provider];
  return { provider, apiKey, model };
}

export function readImageAnalysisTestMode(env: NodeJS.ProcessEnv = process.env): boolean {
  const value = env.AI_TEST_MODE?.trim().toLowerCase();
  return value === 'true' || value === '1';
}

export function createImageAnalysisProvider(config: ImageAnalysisProviderConfig): ImageAnalysisProvider {
  switch (config.provider) {
    case IMAGE_ANALYSIS_PROVIDER.GEMINI:
      return createGeminiImageAnalysisProvider(config);
    case IMAGE_ANALYSIS_PROVIDER.OPENAI:
      return createOpenAiImageAnalysisProvider(config);
    default: {
      throw new Error(`Unsupported image analysis provider: ${config.provider}`);
    }
  }
}
