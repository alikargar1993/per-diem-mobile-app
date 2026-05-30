import type { MoneyDto } from '@/shared/types/api';

export function formatMoney(money: MoneyDto | null | undefined): string {
  if (!money) {
    return '—';
  }
  const amount = money.amount / 100;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: money.currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${money.currency}`;
  }
}
