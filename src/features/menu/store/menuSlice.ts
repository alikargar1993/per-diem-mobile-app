import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MenuResponseDto } from '@/shared/types/api';

type MenuState = {
  data: MenuResponseDto | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  showingStaleCache: boolean;
};

const initialState: MenuState = {
  data: null,
  status: 'idle',
  error: null,
  showingStaleCache: false,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    resetMenu: () => initialState,
    setMenuLoading: state => {
      state.status = 'loading';
      state.error = null;
    },
    setMenuSucceeded: (state, action: PayloadAction<MenuResponseDto>) => {
      state.data = action.payload;
      state.status = 'succeeded';
      state.showingStaleCache = false;
    },
    setMenuFailed: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { resetMenu, setMenuLoading, setMenuSucceeded, setMenuFailed } =
  menuSlice.actions;
export const menuReducer = menuSlice.reducer;
