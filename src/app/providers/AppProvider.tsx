import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { loadCategories } from '@/features/categories/store/categoriesSlice';
import { hydrateFavorites } from '@/features/favorites/store/favoritesSlice';
import {
  hydrateSelectedLocation,
  loadLocations,
} from '@/features/locations/store/locationsSlice';
import { NetworkReconnect } from '@/shared/components/NetworkReconnect';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { store, type AppDispatch } from '@/shared/store';
import { ThemeProvider, useAppTheme } from '@/shared/theme/ThemeContext';

function ThemedStatusBar() {
  const { isDark } = useAppTheme();
  return <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />;
}

const themedAppStyles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1 },
});

function ThemedApp() {
  return (
    <View style={themedAppStyles.root}>
      <ThemedStatusBar />
      <OfflineBanner />
      <NetworkReconnect />
      <View style={themedAppStyles.body}>
        <RootNavigator />
      </View>
    </View>
  );
}

function AppBootstrap() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateFavorites());
    dispatch(hydrateSelectedLocation()).then(() => {
      dispatch(loadLocations());
    });
    dispatch(loadCategories());
  }, [dispatch]);

  return null;
}

const providerStyles = StyleSheet.create({
  gestureRoot: { flex: 1 },
});

export function AppProvider() {
  return (
    <GestureHandlerRootView style={providerStyles.gestureRoot}>
      <Provider store={store}>
        <AppBootstrap />
        <ThemeProvider>
          <SafeAreaProvider>
            <ThemedApp />
          </SafeAreaProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
