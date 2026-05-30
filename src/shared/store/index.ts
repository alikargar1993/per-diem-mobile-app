import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
  type UnknownAction,
} from '@reduxjs/toolkit';
import {
  cartReducer,
  persistCartLines,
} from '@/features/cart/store/cartSlice';
import { categoriesReducer } from '@/features/categories/store/categoriesSlice';
import { locationsReducer } from '@/features/locations/store/locationsSlice';
import { menuReducer } from '@/features/menu/store/menuSlice';
import { searchReducer } from '@/features/search/store/searchSlice';

const rootReducer = combineReducers({
  locations: locationsReducer,
  categories: categoriesReducer,
  menu: menuReducer,
  search: searchReducer,
  cart: cartReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const cartListener = createListenerMiddleware<RootState>();

const cartMutationTypes = new Set([
  'cart/addToCart',
  'cart/incrementQuantity',
  'cart/decrementQuantity',
  'cart/setQuantity',
  'cart/removeFromCart',
  'cart/clearCart',
  'cart/hydrate/fulfilled',
]);

cartListener.startListening({
  predicate: (action): action is UnknownAction =>
    cartMutationTypes.has(action.type),
  effect: async (_action, listenerApi) => {
    const lines = listenerApi.getState().cart.lines;
    await persistCartLines(lines);
  },
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(cartListener.middleware),
});

export type AppDispatch = typeof store.dispatch;
