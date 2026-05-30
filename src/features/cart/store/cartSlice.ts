import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { readCartLines, writeCartLines } from '@/features/cart/storage/cartStorage';
import { cartLineFromMenuItem } from '@/features/cart/utils/cartTotals';
import type { CartLine } from '@/features/cart/types/cart.types';
import type { MenuItemDto } from '@/shared/types/api';

export async function persistCartLines(lines: CartLine[]): Promise<void> {
  await writeCartLines(lines);
}

export const hydrateCart = createAsyncThunk('cart/hydrate', async () =>
  readCartLines(),
);

type CartState = {
  lines: CartLine[];
};

const initialState: CartState = {
  lines: [],
};

function findLineIndex(lines: CartLine[], itemId: string): number {
  return lines.findIndex(line => line.itemId === itemId);
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<MenuItemDto>) => {
      const snapshot = cartLineFromMenuItem(action.payload);
      const index = findLineIndex(state.lines, snapshot.itemId);
      if (index >= 0) {
        state.lines[index].quantity += 1;
        state.lines[index].name = snapshot.name;
        state.lines[index].price = snapshot.price;
        state.lines[index].imageUrl = snapshot.imageUrl;
      } else {
        state.lines.push({ ...snapshot, quantity: 1 });
      }
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const index = findLineIndex(state.lines, action.payload);
      if (index >= 0) {
        state.lines[index].quantity += 1;
      }
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const index = findLineIndex(state.lines, action.payload);
      if (index < 0) {
        return;
      }
      state.lines[index].quantity -= 1;
      if (state.lines[index].quantity <= 0) {
        state.lines.splice(index, 1);
      }
    },
    setQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>,
    ) => {
      const { itemId, quantity } = action.payload;
      const index = findLineIndex(state.lines, itemId);
      if (quantity <= 0) {
        if (index >= 0) {
          state.lines.splice(index, 1);
        }
        return;
      }
      if (index >= 0) {
        state.lines[index].quantity = quantity;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = findLineIndex(state.lines, action.payload);
      if (index >= 0) {
        state.lines.splice(index, 1);
      }
    },
    clearCart: state => {
      state.lines = [];
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateCart.fulfilled, (state, action) => {
      state.lines = action.payload;
    });
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  setQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
