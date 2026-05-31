import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';
import type { CartLine } from '@/features/cart/types/cart.types';
import type { MoneyDto } from '@/shared/types/api';

const STORAGE_KEY = 'cart_lines_v1';

function isMoneyDto(value: unknown): value is MoneyDto {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const o = value as MoneyDto;
  return typeof o.amount === 'number' && typeof o.currency === 'string';
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const o = value as CartLine;
  return (
    typeof o.itemId === 'string' &&
    typeof o.quantity === 'number' &&
    o.quantity > 0 &&
    typeof o.name === 'string' &&
    (o.price === null || isMoneyDto(o.price)) &&
    (o.imageUrl === null || typeof o.imageUrl === 'string')
  );
}

export async function readCartLines(): Promise<CartLine[]> {
  const raw = await getStorageItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

export async function writeCartLines(lines: CartLine[]): Promise<void> {
  await setStorageItem(STORAGE_KEY, JSON.stringify(lines));
}
