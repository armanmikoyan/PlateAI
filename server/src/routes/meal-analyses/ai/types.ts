import type { MealAnalysisResult } from '@/routes/meal-analyses/types.js';

export type ImageAnalysisProviderId = 'gemini' | 'openai';

export type MealImageAnalysisInput = Readonly<{
  imageBase64: string;
  mimeType: string;
}>;

export type ImageAnalysisProviderConfig = Readonly<{
  provider: ImageAnalysisProviderId;
  apiKey: string;
  model: string;
}>;

export type ImageAnalysisProvider = Readonly<{
  id: ImageAnalysisProviderId;
  analyzeMeal: (input: MealImageAnalysisInput) => Promise<MealAnalysisResult>;
}>;
