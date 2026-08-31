import { createGeminiImageAnalysisProvider } from '@/routes/meal-analyses/ai/providers/gemini.js';
import { createOpenAiImageAnalysisProvider } from '@/routes/meal-analyses/ai/providers/openai.js';
import { AiConfigError } from '@/routes/meal-analyses/ai/errors.js';
import type {
  ImageAnalysisProvider,
  ImageAnalysisProviderConfig,
} from '@/routes/meal-analyses/ai/types.js';

export function createImageAnalysisProvider(
  config: ImageAnalysisProviderConfig,
): ImageAnalysisProvider {
  switch (config.provider) {
    case 'gemini':
      return createGeminiImageAnalysisProvider(config);
    case 'openai':
      return createOpenAiImageAnalysisProvider(config);
    default: {
      const unknownProvider: never = config.provider;
      throw new AiConfigError(`Unsupported image analysis provider: ${unknownProvider}`);
    }
  }
}
