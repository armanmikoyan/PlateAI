import type { MealAnalysisSummary } from '@/lib/meal-analyses/types';

export type MealHistoryRowProps = Readonly<{
  item: MealAnalysisSummary;
  onRemove?: (mealId: string) => void;
  removing?: boolean;
}>;

export type UseMealHistoryResult = Readonly<{
  items: readonly MealAnalysisSummary[];
  pendingCount: number;
  loading: boolean;
  error: string | null;
  removingMealId: string | null;
  removeMeal: (mealId: string) => Promise<void>;
  refresh: () => Promise<void>;
}>;
