import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  readCategoriesCache,
  writeCategoriesCache,
} from '@/features/categories/storage/categoriesCache';
import { fetchCategories } from '@/features/menu/api/menuApi';
import { formatApiErrorMessage } from '@/shared/utils/formatApiErrorMessage';
import type { CategoryDto } from '@/shared/types/api';

export type LoadCategoriesPayload =
  | { categories: CategoryDto[]; total: number; fromCache: false }
  | {
      categories: CategoryDto[];
      total: number;
      fromCache: true;
      cacheSavedAtMs: number;
    };

type CategoriesState = {
  items: CategoryDto[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  showingStaleCache: boolean;
  staleCacheSavedAtMs: number | null;
};

const initialState: CategoriesState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
  showingStaleCache: false,
  staleCacheSavedAtMs: null,
};

export const loadCategories = createAsyncThunk<
  LoadCategoriesPayload,
  void,
  { rejectValue: string }
>('categories/loadCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchCategories();
    await writeCategoriesCache(response.categories, response.total);
    return {
      categories: response.categories,
      total: response.total,
      fromCache: false as const,
    };
  } catch (e) {
    const cached = await readCategoriesCache();
    if (cached) {
      return {
        categories: cached.categories,
        total: cached.total,
        fromCache: true as const,
        cacheSavedAtMs: cached.savedAtMs,
      };
    }
    return rejectWithValue(
      formatApiErrorMessage(e, 'Failed to load categories'),
    );
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loadCategories.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.categories;
        state.total = action.payload.total;
        if (action.payload.fromCache) {
          state.showingStaleCache = true;
          state.staleCacheSavedAtMs = action.payload.cacheSavedAtMs;
        } else {
          state.showingStaleCache = false;
          state.staleCacheSavedAtMs = null;
        }
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load categories';
      });
  },
});

export const categoriesReducer = categoriesSlice.reducer;
