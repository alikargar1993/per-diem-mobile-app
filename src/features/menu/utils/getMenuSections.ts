import type { MenuItemDto, MenuResponseDto } from '@/shared/types/api';

export type MenuSection = {
  title: string;
  categoryId: string | null;
  data: MenuItemDto[];
};

export function getMenuSections(
  menu: MenuResponseDto | null,
  selectedCategoryId: string | null,
): MenuSection[] {
  if (!menu) {
    return [];
  }

  const sections: MenuSection[] = menu.categories.map(group => ({
    title: group.category.name,
    categoryId: group.category.id,
    data: group.items,
  }));

  if (menu.uncategorized.length > 0) {
    sections.push({
      title: 'Other',
      categoryId: null,
      data: menu.uncategorized,
    });
  }

  if (selectedCategoryId) {
    return sections.filter(s => s.categoryId === selectedCategoryId);
  }

  return sections.filter(s => s.data.length > 0);
}

export function mergeItemsById(
  menu: MenuResponseDto | null,
): Record<string, MenuItemDto> {
  const byId: Record<string, MenuItemDto> = {};
  if (!menu) {
    return byId;
  }
  for (const group of menu.categories) {
    for (const item of group.items) {
      byId[item.id] = item;
    }
  }
  for (const item of menu.uncategorized) {
    byId[item.id] = item;
  }
  return byId;
}
