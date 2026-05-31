import type { CartLine } from '@/features/cart/types/cart.types';
import type { MenuItemDto, MoneyDto } from '@/shared/types/api';

export function cartLineFromMenuItem(item: MenuItemDto): Omit<CartLine, 'quantity'> {
  return {
    itemId: item.id,
    name: item.name,
    price: item.price,
    imageUrl: item.imageUrl,
  };
}

export function computeLineTotal(line: CartLine): MoneyDto | null {
  if (!line.price) {
    return null;
  }
  return {
    amount: line.price.amount * line.quantity,
    currency: line.price.currency,
  };
}

export function computeSubtotal(lines: CartLine[]): MoneyDto | null {
  if (lines.length === 0) {
    return null;
  }
  const currency = lines.find(l => l.price)?.price?.currency;
  if (!currency) {
    return null;
  }
  let amount = 0;
  for (const line of lines) {
    if (!line.price || line.price.currency !== currency) {
      continue;
    }
    amount += line.price.amount * line.quantity;
  }
  return { amount, currency };
}

export function selectTotalQuantity(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
