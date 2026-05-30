import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from '@reduxjs/toolkit';
import { favoritesReducer, persistFavoriteIds, toggleFavorite } from '@/features/favorites/store/favoritesSlice';
import { locationsReducer } from '@/features/locations/store/locationsSlice';
import { menuReducer } from '@/features/menu/store/menuSlice';
import { searchReducer } from '@/features/search/store/searchSlice';

const rootReducer = combineReducers({
  locations: locationsReducer,
  menu: menuReducer,
  search: searchReducer,
  favorites: favoritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const favoritesListener = createListenerMiddleware<RootState>();

favoritesListener.startListening({
  actionCreator: toggleFavorite,
  effect: async (_action, listenerApi) => {
    const ids = listenerApi.getState().favorites.ids;
    await persistFavoriteIds(ids);
  },
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(favoritesListener.middleware),
});

export type AppDispatch = typeof store.dispatch;
