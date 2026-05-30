import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { fetchLocations } from '@/features/menu/api/menuApi';
import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';
import type { LocationDto } from '@/shared/types/api';

const SELECTED_LOCATION_KEY = 'selected_location_id';

type LocationsState = {
  items: LocationDto[];
  selectedLocationId: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: LocationsState = {
  items: [],
  selectedLocationId: null,
  status: 'idle',
  error: null,
};

export const loadLocations = createAsyncThunk(
  'locations/loadLocations',
  async () => {
    const response = await fetchLocations();
    return response.locations;
  },
);

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
        state.items = action.payload;
        if (state.selectedLocationId) {
          const stillValid = action.payload.some(
            l => l.id === state.selectedLocationId,
          );
          if (!stillValid) {
            state.selectedLocationId = action.payload[0]?.id ?? null;
          }
        } else if (action.payload.length > 0) {
          state.selectedLocationId = action.payload[0].id;
        }
      })
      .addCase(loadLocations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load locations';
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
