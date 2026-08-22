import { describe, expect, it } from 'vitest';

import { createImageAnalysisProvider } from '@/lib/ai/create-provider';
import { AiConfigError } from '@/lib/ai/errors';
import { parseMealImageAnalysis } from '@/lib/ai/parse-analysis';
import { readImageAnalysisProviderConfig, readImageAnalysisTestMode, imageMimeForAnalysis } from '@/lib/ai/utils';

describe('readImageAnalysisProviderConfig', () => {
  it('reads gemini config from env', () => {
    const config = readImageAnalysisProviderConfig({
      AI_IMAGE_PROVIDER: 'gemini',
      AI_PROVIDER_API_KEY: 'test-key',
    });

    expect(config).toEqual({
      provider: 'gemini',
      apiKey: 'test-key',
      model: 'gemini-3.6-flash',
    });
  });

  it('reads openai config with custom model', () => {
    const config = readImageAnalysisProviderConfig({
      AI_IMAGE_PROVIDER: 'openai',
      AI_PROVIDER_API_KEY: 'test-key',
      AI_IMAGE_MODEL: 'gpt-4o',
    });

    expect(config).toEqual({
      provider: 'openai',
      apiKey: 'test-key',
      model: 'gpt-4o',
    });
  });

  it('throws when provider is missing', () => {
    expect(() =>
      readImageAnalysisProviderConfig({
        AI_PROVIDER_API_KEY: 'test-key',
      }),
    ).toThrow(AiConfigError);
  });
});

describe('imageMimeForAnalysis', () => {
  it('uses the file type when present', () => {
    expect(imageMimeForAnalysis({ name: 'meal.png', type: 'image/png' })).toBe('image/png');
  });

  it('falls back from the extension when type is empty', () => {
    expect(imageMimeForAnalysis({ name: 'meal.png', type: '' })).toBe('image/png');
    expect(imageMimeForAnalysis({ name: 'meal.jpg', type: 'application/octet-stream' })).toBe(
      'image/jpeg',
    );
  });
});

describe('readImageAnalysisTestMode', () => {
  it('is enabled for true or 1', () => {
    expect(readImageAnalysisTestMode({ AI_TEST_MODE: 'true' })).toBe(true);
    expect(readImageAnalysisTestMode({ AI_TEST_MODE: '1' })).toBe(true);
  });

  it('is disabled otherwise', () => {
    expect(readImageAnalysisTestMode({ AI_TEST_MODE: 'false' })).toBe(false);
    expect(readImageAnalysisTestMode({})).toBe(false);
  });
});

describe('createImageAnalysisProvider', () => {
  it('creates gemini and openai providers', () => {
    expect(
      createImageAnalysisProvider({
        provider: 'gemini',
        apiKey: 'key',
        model: 'gemini-2.0-flash',
      }).id,
    ).toBe('gemini');

    expect(
      createImageAnalysisProvider({
        provider: 'openai',
        apiKey: 'key',
        model: 'gpt-4o-mini',
      }).id,
    ).toBe('openai');
  });
});

describe('parseMealImageAnalysis', () => {
  it('parses a valid payload', () => {
    expect(
      parseMealImageAnalysis(
        JSON.stringify({
          mealName: 'Chicken bowl',
          calories: 520,
          proteinG: 42,
          carbsG: 38,
          fatG: 18,
          confidence: 'high',
          notes: null,
        }),
      ),
    ).toEqual({
      mealName: 'Chicken bowl',
      calories: 520,
      proteinG: 42,
      carbsG: 38,
      fatG: 18,
      confidence: 'high',
      notes: null,
    });
  });
});
