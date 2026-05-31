import type { DayOfWeek, MealPeriod, MenuAvailabilityDto } from '@/shared/types/api';

const MEAL_LABELS: Record<MealPeriod, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

const DAY_LABELS: Record<DayOfWeek, string> = {
  sun: 'Sunday',
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
};

export function formatMealPeriods(periods: MealPeriod[]): string {
  if (periods.length === 0) {
    return 'Late night — limited menu';
  }
  return periods.map(p => MEAL_LABELS[p]).join(', ');
}

export function formatActiveDay(day: DayOfWeek): string {
  return DAY_LABELS[day];
}

/** Menu banner: local day + active meal periods. */
export function formatAvailabilityLabel(
  availability: MenuAvailabilityDto,
): string {
  const day = formatActiveDay(availability.activeDay);
  const meals = formatMealPeriods(availability.activePeriods);
  return `${day} · ${meals}`;
}
