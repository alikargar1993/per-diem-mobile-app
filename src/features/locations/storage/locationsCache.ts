import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';
import type { LocationDto } from '@/shared/types/api';

const STORAGE_KEY = 'locations_cache_v1';

export type LocationsCacheEntry = {
  locations: LocationDto[];
  savedAtMs: number;
};

function isLocationDto(value: unknown): value is LocationDto {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const o = value as LocationDto;
  return typeof o.id === 'string';
}

export async function readLocationsCache(): Promise<LocationsCacheEntry | null> {
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
    const locations = rec.locations;
    const savedAtMs = rec.savedAtMs;
    if (!Array.isArray(locations) || typeof savedAtMs !== 'number') {
      return null;
    }
    const valid = locations.filter(isLocationDto);
    if (valid.length === 0) {
      return null;
    }
    return { locations: valid, savedAtMs };
  } catch {
    return null;
  }
}

export async function writeLocationsCache(
  locations: LocationDto[],
): Promise<void> {
  const entry: LocationsCacheEntry = { locations, savedAtMs: Date.now() };
  await setStorageItem(STORAGE_KEY, JSON.stringify(entry));
}
