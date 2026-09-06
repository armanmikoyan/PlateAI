export function mealAnalysisImageUrl(analysisId: string): string {
  return `/api/meal-analyses/${encodeURIComponent(analysisId)}/image`;
}