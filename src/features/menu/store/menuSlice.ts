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
import { formatApiErrorMessage } from '@/shared/utils/formatApiErrorMessage';
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
    const message = formatApiErrorMessage(e, 'Failed to load menu');
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

export const loadItemById = createAsyncThunk<
  MenuItemDto,
  { itemId: string; locationId: string },
  { rejectValue: string }
>('menu/loadItemById', async ({ itemId, locationId }, { rejectWithValue }) => {
  try {
    const response = await fetchItemById(itemId, { locationId });
    return response.item;
  } catch (e) {
    return rejectWithValue(
      formatApiErrorMessage(e, 'Unable to load this item.'),
    );
  }
});

type ItemDetailStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type MenuState = {
  data: MenuResponseDto | null;
  itemsById: Record<string, MenuItemDto>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  showingStaleCache: boolean;
  staleCacheSavedAtMs: number | null;
  selectedCategoryId: string | null;
  itemDetailItemId: string | null;
  itemDetailStatus: ItemDetailStatus;
  itemDetailError: string | null;
};

const initialState: MenuState = {
  data: null,
  itemsById: {},
  status: 'idle',
  error: null,
  showingStaleCache: false,
  staleCacheSavedAtMs: null,
  selectedCategoryId: null,
  itemDetailItemId: null,
  itemDetailStatus: 'idle',
  itemDetailError: null,
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
    clearItemDetailState: state => {
      state.itemDetailItemId = null;
      state.itemDetailStatus = 'idle';
      state.itemDetailError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadMenu.pending, (state, action) => {
        state.status = 'loading';
        state.error = null;
        if (state.data?.locationId !== action.meta.arg) {
          state.data = null;
          state.itemsById = {};
        }
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
      .addCase(loadItemById.pending, (state, action) => {
        state.itemDetailItemId = action.meta.arg.itemId;
        state.itemDetailStatus = 'loading';
        state.itemDetailError = null;
      })
      .addCase(loadItemById.fulfilled, (state, action) => {
        state.itemsById[action.payload.id] = action.payload;
        state.itemDetailStatus = 'succeeded';
        state.itemDetailError = null;
      })
      .addCase(loadItemById.rejected, (state, action) => {
        state.itemDetailStatus = 'failed';
        state.itemDetailError =
          action.payload ?? 'Unable to load this item.';
      });
  },
});

export const { resetMenu, setSelectedCategoryId, clearItemDetailState } =
  menuSlice.actions;
export const menuReducer = menuSlice.reducer;
