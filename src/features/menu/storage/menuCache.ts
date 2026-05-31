import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';
import type { MenuResponseDto } from '@/shared/types/api';

const STORAGE_KEY_PREFIX = 'menu_cache_v1:';

export type MenuCacheEntry = {
  data: MenuResponseDto;
  savedAtMs: number;
};

function cacheKey(locationId: string): string {
  return `${STORAGE_KEY_PREFIX}${locationId}`;
}

function isMenuResponseDto(value: unknown): value is MenuResponseDto {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const o = value as MenuResponseDto;
  return typeof o.locationId === 'string' && Array.isArray(o.categories);
}

export async function readMenuCache(
  locationId: string,
): Promise<MenuCacheEntry | null> {
  const raw = await getStorageItem(cacheKey(locationId));
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    const rec = parsed as Record<string, unknown>;
    const data = rec.data;
    const savedAtMs = rec.savedAtMs;
    if (!isMenuResponseDto(data) || typeof savedAtMs !== 'number') {
      return null;
    }
    return { data, savedAtMs };
  } catch {
    return null;
  }
}

export async function writeMenuCache(
  locationId: string,
  data: MenuResponseDto,
): Promise<void> {
  const entry: MenuCacheEntry = { data, savedAtMs: Date.now() };
  await setStorageItem(cacheKey(locationId), JSON.stringify(entry));
}
