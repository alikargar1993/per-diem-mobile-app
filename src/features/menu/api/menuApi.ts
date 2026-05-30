import { apiClient } from '@/shared/api/apiClient';
import type {
  HealthResponseDto,
  ItemDetailResponseDto,
  LocationsResponseDto,
  MenuResponseDto,
  SearchResponseDto,
} from '@/shared/types/api';

export type MenuQueryParams = {
  locationId: string;
  /** ISO 8601 instant for meal-period filtering (defaults to server time). */
  at?: string;
};

export type SearchQueryParams = MenuQueryParams & {
  q: string;
};

/** Client clock as ISO string — pass on every menu/search call for correct meal filtering. */
export function clientReferenceTime(): string {
  return new Date().toISOString();
}

export async function fetchHealth(): Promise<HealthResponseDto> {
  const { data } = await apiClient.get<HealthResponseDto>('/health');
  return data;
}

export async function fetchLocations(): Promise<LocationsResponseDto> {
  const { data } = await apiClient.get<LocationsResponseDto>('/api/locations');
  return data;
}

export async function fetchMenu(
  params: MenuQueryParams,
): Promise<MenuResponseDto> {
  const { data } = await apiClient.get<MenuResponseDto>('/api/menu', {
    params: {
      locationId: params.locationId,
      at: params.at ?? clientReferenceTime(),
    },
  });
  return data;
}

export async function fetchItemById(
  itemId: string,
  params: MenuQueryParams,
): Promise<ItemDetailResponseDto> {
  const { data } = await apiClient.get<ItemDetailResponseDto>(
    `/api/items/${encodeURIComponent(itemId)}`,
    {
      params: {
        locationId: params.locationId,
        at: params.at ?? clientReferenceTime(),
      },
    },
  );
  return data;
}

export async function searchMenu(
  params: SearchQueryParams,
): Promise<SearchResponseDto> {
  const { data } = await apiClient.get<SearchResponseDto>('/api/search', {
    params: {
      locationId: params.locationId,
      q: params.q,
      at: params.at ?? clientReferenceTime(),
    },
  });
  return data;
}
