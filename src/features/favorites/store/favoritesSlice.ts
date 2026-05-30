import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';

const STORAGE_KEY = 'favorite_item_ids';

async function readIds(): Promise<string[]> {
  const raw = await getStorageItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((id): id is string => typeof id === 'string');
  } catch {
    return [];
  }
}

export async function persistFavoriteIds(ids: string[]): Promise<void> {
  await setStorageItem(STORAGE_KEY, JSON.stringify(ids));
}

export const hydrateFavorites = createAsyncThunk(
  'favorites/hydrate',
  async () => readIds(),
);

type FavoritesState = {
  ids: string[];
};

const initialState: FavoritesState = {
  ids: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.ids.indexOf(id);
      if (index >= 0) {
        state.ids.splice(index, 1);
      } else {
        state.ids.push(id);
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateFavorites.fulfilled, (state, action) => {
      state.ids = action.payload;
    });
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;
