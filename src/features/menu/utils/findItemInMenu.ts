import type { MenuItemDto, MenuResponseDto } from '@/shared/types/api';

export function findItemInMenu(
  menu: MenuResponseDto,
  itemId: string,
): MenuItemDto | null {
  for (const group of menu.categories) {
    const match = group.items.find(item => item.id === itemId);
    if (match) {
      return match;
    }
  }
  const uncategorized = menu.uncategorized.find(item => item.id === itemId);
  return uncategorized ?? null;
}
