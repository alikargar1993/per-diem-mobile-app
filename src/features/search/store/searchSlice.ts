import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { searchMenu } from '@/features/menu/api/menuApi';
import { formatApiErrorMessage } from '@/shared/utils/formatApiErrorMessage';
import type { MenuItemDto } from '@/shared/types/api';

export const performSearch = createAsyncThunk<
  { query: string; items: MenuItemDto[]; total: number },
  { q: string; locationId?: string },
  { rejectValue: string }
>('search/performSearch', async (params, { rejectWithValue }) => {
  try {
    const response = await searchMenu({
      q: params.q,
      locationId: params.locationId,
    });
    return {
      query: response.query,
      items: response.items,
      total: response.total,
    };
  } catch (e) {
    return rejectWithValue(formatApiErrorMessage(e, 'Search failed'));
  }
});

type SearchState = {
  query: string;
  results: MenuItemDto[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: SearchState = {
  query: '',
  results: [],
  total: 0,
  status: 'idle',
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      if (action.payload.trim().length === 0) {
        state.results = [];
        state.total = 0;
        state.status = 'idle';
        state.error = null;
      }
    },
    resetSearch: () => initialState,
  },
  extraReducers: builder => {
    builder
      .addCase(performSearch.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.query = action.payload.query;
        state.results = action.payload.items;
        state.total = action.payload.total;
        state.status = 'succeeded';
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Search failed';
        state.results = [];
        state.total = 0;
      });
  },
});

export const { setSearchQuery, resetSearch } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
