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
import { MenuListItem } from '@/features/menu/components/MenuListItem';
import { MenuListSkeleton } from '@/features/menu/components/MenuListSkeleton';
import { loadMenu, setSelectedCategoryId } from '@/features/menu/store/menuSlice';
import { formatMealPeriods } from '@/features/menu/utils/formatMealPeriods';
import {
  getMenuSections,
  type MenuSection,
} from '@/features/menu/utils/getMenuSections';
import { ThemeHeaderButton } from '@/shared/components/ThemeHeaderButton';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { AppButton, AppScreen, AppText } from '@/shared/components/ui';
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

  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );
  const menuData = useAppSelector(state => state.menu.data);
  const status = useAppSelector(state => state.menu.status);
  const error = useAppSelector(state => state.menu.error);
  const selectedCategoryId = useAppSelector(
    state => state.menu.selectedCategoryId,
  );
  const showingStaleCache = useAppSelector(
    state => state.menu.showingStaleCache,
  );
  const staleCacheSavedAtMs = useAppSelector(
    state => state.menu.staleCacheSavedAtMs,
  );

  const sections = useMemo(
    () => getMenuSections(menuData, selectedCategoryId),
    [menuData, selectedCategoryId],
  );

  const staleNotice = useMemo(() => {
    if (!showingStaleCache || staleCacheSavedAtMs == null) {
      return null;
    }
    return `Could not refresh the menu. Showing saved data from ${formatCacheAge(staleCacheSavedAtMs)}. Pull to refresh to try again.`;
  }, [showingStaleCache, staleCacheSavedAtMs]);

  const availabilityLabel = useMemo(() => {
    if (!menuData?.availability) {
      return null;
    }
    return formatMealPeriods(menuData.availability.activePeriods);
  }, [menuData?.availability]);

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

  const onRefresh = useCallback(() => {
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

  if (!selectedLocationId && status !== 'loading') {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <View style={styles.centered}>
          <AppText variant="body" muted>
            No location selected. Choose a location to view the menu.
          </AppText>
        </View>
      </AppScreen>
    );
  }

  if (status === 'loading' && !menuData) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <LocationPicker />
        <MenuListSkeleton />
      </AppScreen>
    );
  }

  if (status === 'failed' && !menuData) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <View style={styles.centered}>
          <AppText variant="subtitle">Could not load menu</AppText>
          <AppText variant="body" muted style={styles.errorText}>
            {error}
          </AppText>
          <AppButton label="Try again" onPress={onRefresh} />
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <LocationPicker />
      {availabilityLabel ? (
        <View
          style={[
            styles.availabilityBanner,
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
      <CategoryFilter />
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading' && menuData != null}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText variant="body" muted>
              {selectedCategoryId
                ? 'No items in this category for the current meal period.'
                : 'No menu items available for this location right now.'}
            </AppText>
          </View>
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
  },
  errorText: {
    marginBottom: 8,
  },
  availabilityBanner: {
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  staleBanner: {
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  empty: {
    padding: 24,
  },
});
