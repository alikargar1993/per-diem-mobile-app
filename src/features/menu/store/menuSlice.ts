import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { fetchItemById, fetchMenu } from '@/features/menu/api/menuApi';
import {
  readMenuCache,
  writeMenuCache,
} from '@/features/menu/storage/menuCache';
import { mergeItemsById } from '@/features/menu/utils/getMenuSections';
import type { MenuItemDto, MenuResponseDto } from '@/shared/types/api';

export type LoadMenuPayload =
  | { data: MenuResponseDto; fromCache: false }
  | { data: MenuResponseDto; fromCache: true; cacheSavedAtMs: number };

export const loadMenu = createAsyncThunk<
  LoadMenuPayload,
  string,
  { rejectValue: string }
>('menu/loadMenu', async (locationId, { rejectWithValue }) => {
  try {
    const data = await fetchMenu({ locationId });
    await writeMenuCache(locationId, data);
    return { data, fromCache: false as const };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to load menu';
    const cached = await readMenuCache(locationId);
    if (cached) {
      return {
        data: cached.data,
        fromCache: true as const,
        cacheSavedAtMs: cached.savedAtMs,
      };
    }
    return rejectWithValue(message);
  }
});

export const loadItemById = createAsyncThunk(
  'menu/loadItemById',
  async ({
    itemId,
    locationId,
  }: {
    itemId: string;
    locationId: string;
  }) => {
    const response = await fetchItemById(itemId, { locationId });
    return response.item;
  },
);

type MenuState = {
  data: MenuResponseDto | null;
  itemsById: Record<string, MenuItemDto>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  showingStaleCache: boolean;
  staleCacheSavedAtMs: number | null;
  selectedCategoryId: string | null;
};

const initialState: MenuState = {
  data: null,
  itemsById: {},
  status: 'idle',
  error: null,
  showingStaleCache: false,
  staleCacheSavedAtMs: null,
  selectedCategoryId: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    resetMenu: () => initialState,
    setSelectedCategoryId: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedCategoryId = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadMenu.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadMenu.fulfilled, (state, action) => {
        state.data = action.payload.data;
        state.itemsById = mergeItemsById(action.payload.data);
        state.status = 'succeeded';
        if (action.payload.fromCache) {
          state.showingStaleCache = true;
          state.staleCacheSavedAtMs = action.payload.cacheSavedAtMs;
        } else {
          state.showingStaleCache = false;
          state.staleCacheSavedAtMs = null;
        }
      })
      .addCase(loadMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load menu';
      })
      .addCase(loadItemById.fulfilled, (state, action) => {
        state.itemsById[action.payload.id] = action.payload;
      });
  },
});

export const { resetMenu, setSelectedCategoryId } = menuSlice.actions;
export const menuReducer = menuSlice.reducer;
