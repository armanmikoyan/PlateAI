import type { AuthUser } from '@/app/api/auth/types';

import type { MealAnalysisSummary } from '@plate/plate-ai/types';

export type MealHistoryProps = Readonly<{
  user: AuthUser | null;
  justPurchased?: boolean;
}>;

export type MealHistoryRowProps = Readonly<{
  item: MealAnalysisSummary;
}>;

export type UseMealHistoryResult = Readonly<{
  items: readonly MealAnalysisSummary[];
  pendingCount: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}>;
