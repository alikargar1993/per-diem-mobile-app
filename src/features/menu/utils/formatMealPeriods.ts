import type { MealPeriod } from '@/shared/types/api';

const LABELS: Record<MealPeriod, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

export function formatMealPeriods(periods: MealPeriod[]): string {
  if (periods.length === 0) {
    return 'Late night — limited menu';
  }
  return periods.map(p => LABELS[p]).join(', ');
}
