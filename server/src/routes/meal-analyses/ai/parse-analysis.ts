import { MEAL_ANALYSIS_CONFIDENCE } from '@/routes/meal-analyses/constants.js';
import type { MealAnalysisConfidence } from '@/routes/meal-analyses/constants.js';
import type { MealAnalysisResult } from '@/routes/meal-analyses/types.js';
import { AiParseError } from '@/routes/meal-analyses/ai/errors.js';

type RawMealAnalysis = Readonly<{
  mealName?: unknown;
  calories?: unknown;
  proteinG?: unknown;
  carbsG?: unknown;
  fatG?: unknown;
  confidence?: unknown;
  notes?: unknown;
}>;

const CONFIDENCE_VALUES: readonly MealAnalysisConfidence[] = Object.values(MEAL_ANALYSIS_CONFIDENCE);

function isConfidence(value: unknown): value is MealAnalysisConfidence {
  return typeof value === 'string' && CONFIDENCE_VALUES.some((entry) => entry === value);
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
  let parsed: RawMealAnalysis;

  try {
    parsed = JSON.parse(rawText) as RawMealAnalysis;
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
