import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories } from '@/features/menu/api/menuApi';
import { formatApiErrorMessage } from '@/shared/utils/formatApiErrorMessage';
import type { CategoryDto } from '@/shared/types/api';

type CategoriesState = {
  items: CategoryDto[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: CategoriesState = {
  items: [],
  total: 0,
  status: 'idle',
  error: null,
};

export const loadCategories = createAsyncThunk<
  { categories: CategoryDto[]; total: number },
  void,
  { rejectValue: string }
>('categories/loadCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await fetchCategories();
    return response;
  } catch (e) {
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
      })
      .addCase(loadCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to load categories';
      });
  },
});

export const categoriesReducer = categoriesSlice.reducer;
