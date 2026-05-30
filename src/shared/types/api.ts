export type MoneyDto = {
  /** Amount in the smallest currency unit (e.g. cents). */
  amount: number;
  currency: string;
};

export type LocationDto = {
  id: string;
  name: string | null;
  status: string | null;
  timezone: string | null;
  addressLine1: string | null;
  locality: string | null;
};

export type CategoryDto = {
  id: string;
  name: string;
  ordinal: number | null;
};

export type ItemVariationDto = {
  id: string;
  name: string | null;
  price: MoneyDto | null;
  ordinal: number | null;
};

export type MenuItemDto = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryIds: string[];
  price: MoneyDto | null;
  variations: ItemVariationDto[];
};

export type MenuCategoryGroupDto = {
  category: CategoryDto;
  items: MenuItemDto[];
};

export type MealPeriod = 'breakfast' | 'lunch' | 'dinner';

export type MenuAvailabilityDto = {
  referenceTime: string;
  timezone: string;
  activePeriods: MealPeriod[];
};

export type MenuResponseDto = {
  locationId: string;
  availability: MenuAvailabilityDto;
  categories: MenuCategoryGroupDto[];
  uncategorized: MenuItemDto[];
};

export type LocationsResponseDto = {
  locations: LocationDto[];
};

export type ItemDetailResponseDto = {
  item: MenuItemDto;
};

export type SearchResponseDto = {
  query: string;
  locationId: string;
  availability: MenuAvailabilityDto;
  items: MenuItemDto[];
  total: number;
};

export type HealthResponseDto = {
  status: string;
  squareEnvironment: string;
};
