import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';
import type { CategoryDto } from '@/shared/types/api';

const STORAGE_KEY = 'categories_cache_v1';

export type CategoriesCacheEntry = {
  categories: CategoryDto[];
  total: number;
  savedAtMs: number;
};

function isCategoryDto(value: unknown): value is CategoryDto {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const o = value as CategoryDto;
  return typeof o.id === 'string' && typeof o.name === 'string';
}

export async function readCategoriesCache(): Promise<CategoriesCacheEntry | null> {
  const raw = await getStorageItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const rec = parsed as Record<string, unknown>;
    const categories = rec.categories;
    const total = rec.total;
    const savedAtMs = rec.savedAtMs;
    if (
      !Array.isArray(categories) ||
      typeof total !== 'number' ||
      typeof savedAtMs !== 'number'
    ) {
      return null;
    }
    const valid = categories.filter(isCategoryDto);
    if (valid.length === 0) {
      return null;
    }
    return { categories: valid, total, savedAtMs };
  } catch {
    return null;
  }
}

export async function writeCategoriesCache(
  categories: CategoryDto[],
  total: number,
): Promise<void> {
  const entry: CategoriesCacheEntry = {
    categories,
    total,
    savedAtMs: Date.now(),
  };
  await setStorageItem(STORAGE_KEY, JSON.stringify(entry));
}
