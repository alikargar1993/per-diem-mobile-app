import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { fetchLocations } from '@/features/menu/api/menuApi';
import {
  readLocationsCache,
  writeLocationsCache,
} from '@/features/locations/storage/locationsCache';
import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';
import { formatApiErrorMessage } from '@/shared/utils/formatApiErrorMessage';
import type { LocationDto } from '@/shared/types/api';

const SELECTED_LOCATION_KEY = 'selected_location_id';

export type LoadLocationsPayload =
  | { locations: LocationDto[]; fromCache: false }
  | { locations: LocationDto[]; fromCache: true; cacheSavedAtMs: number };

type LocationsState = {
  items: LocationDto[];
  selectedLocationId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  showingStaleCache: boolean;
  staleCacheSavedAtMs: number | null;
};

const initialState: LocationsState = {
  items: [],
  selectedLocationId: null,
  status: 'idle',
  error: null,
  showingStaleCache: false,
  staleCacheSavedAtMs: null,
};

export const loadLocations = createAsyncThunk<
  LoadLocationsPayload,
  void,
  { rejectValue: string }
>('locations/loadLocations', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchLocations();
    await writeLocationsCache(response.locations);
    return { locations: response.locations, fromCache: false as const };
  } catch (e) {
    const cached = await readLocationsCache();
    if (cached) {
      return {
        locations: cached.locations,
        fromCache: true as const,
        cacheSavedAtMs: cached.savedAtMs,
      };
    }
    return rejectWithValue(
      formatApiErrorMessage(e, 'Failed to load locations'),
    );
  }
});

export const hydrateSelectedLocation = createAsyncThunk(
  'locations/hydrateSelectedLocation',
  async () => {
    const stored = await getStorageItem(SELECTED_LOCATION_KEY);
    return stored || null;
  },
);

const locationsSlice = createSlice({
  name: 'locations',
  initialState,
  reducers: {
    selectLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocationId = action.payload;
      void setStorageItem(SELECTED_LOCATION_KEY, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadLocations.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadLocations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.locations;
        if (action.payload.fromCache) {
          state.showingStaleCache = true;
          state.staleCacheSavedAtMs = action.payload.cacheSavedAtMs;
        } else {
          state.showingStaleCache = false;
          state.staleCacheSavedAtMs = null;
        }
        if (action.payload.locations.length === 0) {
          state.selectedLocationId = null;
          return;
        }
        if (state.selectedLocationId) {
          const stillValid = action.payload.locations.some(
            l => l.id === state.selectedLocationId,
          );
          if (!stillValid) {
            state.selectedLocationId = action.payload.locations[0]?.id ?? null;
          }
        } else {
          state.selectedLocationId = action.payload.locations[0].id;
        }
      })
      .addCase(loadLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load locations';
      })
      .addCase(hydrateSelectedLocation.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedLocationId = action.payload;
        }
      });
  },
});

export const { selectLocation } = locationsSlice.actions;
export const locationsReducer = locationsSlice.reducer;
