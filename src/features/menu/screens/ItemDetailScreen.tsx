import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MenuStackParamList } from '@/app/navigation/types';
import { loadItemById } from '@/features/menu/store/menuSlice';
import { formatMoney } from '@/features/menu/utils/formatMoney';
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
  const [loadError, setLoadError] = useState<string | null>(null);

  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );
  const item = useAppSelector(state => state.menu.itemsById[itemId]);

  useEffect(() => {
    if (item || !selectedLocationId) {
      setLoadError(null);
      return;
    }
    let cancelled = false;
    dispatch(loadItemById({ itemId, locationId: selectedLocationId }))
      .unwrap()
      .catch(e => {
        if (!cancelled) {
          setLoadError(
            e instanceof Error ? e.message : 'Unable to load this item.',
          );
        }
      });
    return () => {
      cancelled = true;
    };
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

  if (!item && loadError) {
    return (
      <AppScreen>
        <View style={styles.centered}>
          <AppText variant="subtitle">Item not available</AppText>
          <AppText variant="body" muted>
            {loadError}
          </AppText>
          <AppButton label="Go back" onPress={onGoBack} />
        </View>
      </AppScreen>
    );
  }

  if (!item) {
    return (
      <AppScreen>
        <View style={styles.centered}>
          <AppText variant="body" muted>
            Loading item…
          </AppText>
        </View>
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
          ) : null}
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
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  centered: {
    flex: 1,
    padding: 20,
    gap: 12,
    justifyContent: 'center',
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
