import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react';
import {
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MenuStackParamList } from '@/app/navigation/types';
import { CategoryFilter } from '@/features/categories/components/CategoryFilter';
import { LocationPicker } from '@/features/locations/components/LocationPicker';
import { loadLocations } from '@/features/locations/store/locationsSlice';
import { MenuListItem } from '@/features/menu/components/MenuListItem';
import { MenuListSkeleton } from '@/features/menu/components/MenuListSkeleton';
import { loadMenu, setSelectedCategoryId } from '@/features/menu/store/menuSlice';
import { formatMealPeriods } from '@/features/menu/utils/formatMealPeriods';
import {
  getMenuSections,
  type MenuSection,
} from '@/features/menu/utils/getMenuSections';
import { ThemeHeaderButton } from '@/shared/components/ThemeHeaderButton';
import { ScreenStatePanel } from '@/shared/components/ScreenStatePanel';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { AppScreen, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import type { MenuItemDto } from '@/shared/types/api';

type Props = NativeStackScreenProps<MenuStackParamList, 'MenuList'>;

function formatCacheAge(savedAtMs: number): string {
  const minutes = Math.max(1, Math.round((Date.now() - savedAtMs) / 60_000));
  return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
}

export function MenuListScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const { isOffline } = useNetworkStatus();

  const locationsStatus = useAppSelector(state => state.locations.status);
  const locationsError = useAppSelector(state => state.locations.error);
  const locationsCount = useAppSelector(state => state.locations.items.length);
  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );
  const menuData = useAppSelector(state => state.menu.data);
  const menuStatus = useAppSelector(state => state.menu.status);
  const menuError = useAppSelector(state => state.menu.error);
  const selectedCategoryId = useAppSelector(
    state => state.menu.selectedCategoryId,
  );
  const showingStaleCache = useAppSelector(
    state => state.menu.showingStaleCache,
  );
  const staleCacheSavedAtMs = useAppSelector(
    state => state.menu.staleCacheSavedAtMs,
  );

  const menuMatchesLocation =
    menuData != null && menuData.locationId === selectedLocationId;

  const sections = useMemo(
    () => (menuMatchesLocation ? getMenuSections(menuData, selectedCategoryId) : []),
    [menuData, menuMatchesLocation, selectedCategoryId],
  );

  const staleNotice = useMemo(() => {
    if (!showingStaleCache || staleCacheSavedAtMs == null) {
      return null;
    }
    const age = formatCacheAge(staleCacheSavedAtMs);
    if (isOffline) {
      return `You are offline. Showing saved menu from ${age}.`;
    }
    return `Could not refresh the menu. Showing saved data from ${age}. Pull to refresh to try again.`;
  }, [isOffline, showingStaleCache, staleCacheSavedAtMs]);

  const availabilityLabel = useMemo(() => {
    if (!menuMatchesLocation || !menuData?.availability) {
      return null;
    }
    return formatMealPeriods(menuData.availability.activePeriods);
  }, [menuData?.availability, menuMatchesLocation]);

  const refreshErrorNotice = useMemo(() => {
    if (menuStatus !== 'failed' || !menuMatchesLocation || !menuData) {
      return null;
    }
    return menuError;
  }, [menuData, menuError, menuMatchesLocation, menuStatus]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ThemeHeaderButton />,
    });
  }, [navigation]);

  useEffect(() => {
    dispatch(setSelectedCategoryId(null));
    if (selectedLocationId) {
      dispatch(loadMenu(selectedLocationId));
    }
  }, [dispatch, selectedLocationId]);

  const onRefreshLocations = useCallback(() => {
    dispatch(loadLocations());
  }, [dispatch]);

  const onRefreshMenu = useCallback(() => {
    if (selectedLocationId) {
      dispatch(loadMenu(selectedLocationId));
    }
  }, [dispatch, selectedLocationId]);

  const onOpenItem = useCallback(
    (itemId: string) => {
      navigation.navigate('ItemDetail', { itemId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: MenuItemDto }) => (
      <MenuListItem item={item} onOpenItem={onOpenItem} />
    ),
    [onOpenItem],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: MenuSection }) => (
      <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
        <AppText variant="label" muted>
          {section.title}
        </AppText>
      </View>
    ),
    [colors.background],
  );

  if (locationsStatus === 'loading' && locationsCount === 0) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <ScreenStatePanel
          loading
          title="Loading locations"
          loadingMessage="Fetching store locations…"
        />
      </AppScreen>
    );
  }

  if (locationsStatus === 'failed' && locationsCount === 0) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <ScreenStatePanel
          title={isOffline ? 'You are offline' : 'Could not load locations'}
          message={
            isOffline
              ? 'No saved locations found on this device. Connect to the internet to load store locations.'
              : (locationsError ?? undefined)
          }
          actionLabel={isOffline ? undefined : 'Try again'}
          onAction={isOffline ? undefined : onRefreshLocations}
        />
      </AppScreen>
    );
  }

  if (locationsStatus === 'succeeded' && locationsCount === 0) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <ScreenStatePanel
          title="No locations available"
          message="There are no store locations to browse right now. Pull to refresh or try again later."
          actionLabel="Refresh"
          onAction={onRefreshLocations}
        />
      </AppScreen>
    );
  }

  if (!selectedLocationId) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <LocationPicker />
        <ScreenStatePanel
          title="Choose a location"
          message="Select a store location to view its menu."
        />
      </AppScreen>
    );
  }

  if (
    (menuStatus === 'loading' && !menuMatchesLocation) ||
    (menuStatus === 'idle' && !menuData)
  ) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <LocationPicker />
        <MenuListSkeleton />
      </AppScreen>
    );
  }

  if (menuStatus === 'failed' && !menuMatchesLocation) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <LocationPicker />
        <ScreenStatePanel
          title={isOffline ? 'You are offline' : 'Could not load menu'}
          message={
            isOffline
              ? 'No saved menu found for this location. Connect to the internet to load the latest menu.'
              : (menuError ?? undefined)
          }
          actionLabel={isOffline ? undefined : 'Try again'}
          onAction={isOffline ? undefined : onRefreshMenu}
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <LocationPicker />
      {availabilityLabel ? (
        <View
          style={[
            styles.banner,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
          <AppText variant="caption" muted>
            Available now: {availabilityLabel}
          </AppText>
        </View>
      ) : null}
      {staleNotice ? (
        <View
          style={[
            styles.banner,
            styles.staleBanner,
            {
              backgroundColor: colors.offlineBanner,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="alert">
          <AppText variant="caption" style={{ color: colors.offlineBannerText }}>
            {staleNotice}
          </AppText>
        </View>
      ) : null}
      {refreshErrorNotice ? (
        <View
          style={[
            styles.banner,
            styles.staleBanner,
            {
              backgroundColor: colors.offlineBanner,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="alert">
          <AppText variant="caption" style={{ color: colors.offlineBannerText }}>
            {refreshErrorNotice}
          </AppText>
        </View>
      ) : null}
      <CategoryFilter />
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        refreshControl={
          <RefreshControl
            refreshing={menuStatus === 'loading' && menuMatchesLocation}
            onRefresh={onRefreshMenu}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant="subtitle">
              {selectedCategoryId ? 'Nothing in this category' : 'Menu is empty'}
            </AppText>
            <AppText variant="body" muted style={styles.emptyMessage}>
              {selectedCategoryId
                ? 'Try another category or check back during the next meal period.'
                : 'No items are available at this location for the current meal period.'}
            </AppText>
          </View>
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  staleBanner: {
    paddingVertical: 10,
    borderRadius: 10,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  empty: {
    padding: 24,
    gap: 8,
  },
  emptyMessage: {
    marginTop: 4,
  },
});
