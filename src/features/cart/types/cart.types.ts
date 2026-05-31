import type { MoneyDto } from '@/shared/types/api';

/** Snapshot of menu item data stored with each cart line for offline display. */
export type CartLine = {
  itemId: string;
  quantity: number;
  name: string;
  price: MoneyDto | null;
  imageUrl: string | null;
};
