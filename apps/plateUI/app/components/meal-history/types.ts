import type { AuthUser } from '@/app/api/auth/types';

import type { MealAnalysisSummary } from '@/app/utils/meal-analyses/types';

export type MealHistoryProps = Readonly<{
  user: AuthUser | null;
  justPurchased?: boolean;
}>;

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
