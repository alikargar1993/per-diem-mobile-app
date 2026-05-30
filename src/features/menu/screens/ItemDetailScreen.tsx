import React, { useCallback, useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MenuStackParamList } from '@/app/navigation/types';
import { ItemDetailSkeleton } from '@/features/menu/components/ItemDetailSkeleton';
import {
  clearItemDetailState,
  loadItemById,
} from '@/features/menu/store/menuSlice';
import { formatMoney } from '@/features/menu/utils/formatMoney';
import { ScreenStatePanel } from '@/shared/components/ScreenStatePanel';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  AppButton,
  AppImage,
  AppScreen,
  AppText,
} from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type Props = NativeStackScreenProps<MenuStackParamList, 'ItemDetail'>;

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="body" style={styles.metaValue}>
        {value}
      </AppText>
    </View>
  );
}

export function ItemDetailScreen({ navigation, route }: Props) {
  const { itemId } = route.params;
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const { isOffline } = useNetworkStatus();

  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );
  const item = useAppSelector(state => state.menu.itemsById[itemId]);
  const itemDetailItemId = useAppSelector(state => state.menu.itemDetailItemId);
  const itemDetailStatus = useAppSelector(state => state.menu.itemDetailStatus);
  const itemDetailError = useAppSelector(state => state.menu.itemDetailError);

  const isLoadingItem =
    !item &&
    itemDetailItemId === itemId &&
    itemDetailStatus === 'loading';
  const loadFailed =
    !item &&
    itemDetailItemId === itemId &&
    itemDetailStatus === 'failed';

  useEffect(() => {
    return () => {
      dispatch(clearItemDetailState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (item || !selectedLocationId) {
      return;
    }
    dispatch(loadItemById({ itemId, locationId: selectedLocationId }));
  }, [dispatch, item, itemId, selectedLocationId]);

  const surfaceStyle = useMemo(
    () => ({
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
    }),
    [colors.border, colors.surface],
  );

  const onGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onRetry = useCallback(() => {
    if (selectedLocationId) {
      dispatch(loadItemById({ itemId, locationId: selectedLocationId }));
    }
  }, [dispatch, itemId, selectedLocationId]);

  if (!selectedLocationId) {
    return (
      <AppScreen>
        <ScreenStatePanel
          title="No location selected"
          message="Choose a store location on the menu tab to view item details."
          actionLabel="Go back"
          onAction={onGoBack}
        />
      </AppScreen>
    );
  }

  if (loadFailed) {
    return (
      <AppScreen>
        <ScreenStatePanel
          title="Item not available"
          message={
            isOffline
              ? 'This item is not in your saved menu. Connect to the internet to load the latest item details.'
              : (itemDetailError ??
                'This item may not be available at the selected location or during the current meal period.')
          }
          actionLabel={isOffline ? 'Go back' : 'Try again'}
          onAction={isOffline ? onGoBack : onRetry}
        />
      </AppScreen>
    );
  }

  if (isLoadingItem) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <ItemDetailSkeleton />
      </AppScreen>
    );
  }

  if (!item) {
    return (
      <AppScreen>
        <ScreenStatePanel
          loading
          title="Loading item"
          loadingMessage="Fetching item details…"
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {item.imageUrl ? (
          <AppImage
            source={{ uri: item.imageUrl }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        ) : null}
        <View style={surfaceStyle}>
          <AppText variant="title">{item.name}</AppText>
          <AppText variant="subtitle" style={styles.price}>
            {formatMoney(item.price)}
          </AppText>
          {item.description ? (
            <AppText variant="body" muted style={styles.description}>
              {item.description}
            </AppText>
          ) : (
            <AppText variant="body" muted style={styles.description}>
              No description available.
            </AppText>
          )}
        </View>
        {item.variations.length > 0 ? (
          <View style={surfaceStyle}>
            <AppText variant="label" muted>
              Variations
            </AppText>
            {item.variations.map(variation => (
              <MetaRow
                key={variation.id}
                label={variation.name ?? 'Option'}
                value={formatMoney(variation.price)}
              />
            ))}
          </View>
        ) : null}
        <AppButton label="Back to menu" variant="secondary" onPress={onGoBack} />
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
  price: {
    marginTop: 8,
  },
  description: {
    marginTop: 12,
  },
  metaRow: {
    marginTop: 10,
  },
  metaValue: {
    marginTop: 4,
  },
});
