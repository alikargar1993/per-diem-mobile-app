import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MenuItemDto } from '@/shared/types/api';

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
    },
    resetSearch: () => initialState,
    setSearchLoading: state => {
      state.status = 'loading';
      state.error = null;
    },
    setSearchSucceeded: (
      state,
      action: PayloadAction<{ items: MenuItemDto[]; total: number }>,
    ) => {
      state.results = action.payload.items;
      state.total = action.payload.total;
      state.status = 'succeeded';
    },
    setSearchFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  resetSearch,
  setSearchLoading,
  setSearchSucceeded,
  setSearchFailed,
} = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
