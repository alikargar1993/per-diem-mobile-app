import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { loadLocations, selectLocation } from '@/features/locations/store/locationsSlice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  AppButton,
  AppDivider,
  AppPressable,
  AppText,
  Icon,
} from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import type { LocationDto } from '@/shared/types/api';

export function LocationPicker() {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);

  const locations = useAppSelector(state => state.locations.items);
  const locationsStatus = useAppSelector(state => state.locations.status);
  const locationsError = useAppSelector(state => state.locations.error);
  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );

  const selectedLocation = locations.find(l => l.id === selectedLocationId);
  const isLoading = locationsStatus === 'loading' && locations.length === 0;

  const onSelect = useCallback(
    (location: LocationDto) => {
      dispatch(selectLocation(location.id));
      setOpen(false);
    },
    [dispatch],
  );

  const onRetry = useCallback(() => {
    dispatch(loadLocations());
  }, [dispatch]);

  const label = isLoading
    ? 'Loading locations…'
    : selectedLocation?.name ?? 'Select location';

  return (
    <>
      <AppPressable
        accessibilityRole="button"
        accessibilityLabel="Choose location"
        disabled={isLoading}
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed || isLoading ? 0.85 : 1,
          },
        ]}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Icon name="location" size={20} color={colors.primary} />
        )}
        <View style={styles.triggerText}>
          <AppText variant="caption" muted>
            Location
          </AppText>
          <AppText variant="label" numberOfLines={1}>
            {label}
          </AppText>
        </View>
      </AppPressable>

      {locationsStatus === 'failed' ? (
        <View style={styles.inlineError}>
          <AppText variant="caption" muted numberOfLines={2}>
            {locationsError ?? 'Could not load locations.'}
          </AppText>
          <AppButton label="Retry" variant="ghost" onPress={onRetry} />
        </View>
      ) : null}

      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}>
        <View style={styles.backdrop}>
          <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
            <View style={styles.sheetHeader}>
              <AppText variant="subtitle">Choose location</AppText>
              <AppPressable onPress={() => setOpen(false)}>
                <AppText variant="label" style={{ color: colors.primary }}>
                  Done
                </AppText>
              </AppPressable>
            </View>

            {locationsStatus === 'loading' && locations.length === 0 ? (
              <View style={styles.sheetLoading}>
                <ActivityIndicator size="large" color={colors.textMuted} />
                <AppText variant="caption" muted>
                  Loading locations…
                </AppText>
              </View>
            ) : null}

            {locationsStatus === 'failed' ? (
              <View style={styles.sheetEmpty}>
                <AppText variant="body" muted>
                  {locationsError ?? 'Could not load locations.'}
                </AppText>
                <AppButton label="Try again" onPress={onRetry} />
              </View>
            ) : null}

            {locations.length === 0 &&
            locationsStatus === 'succeeded' ? (
              <View style={styles.sheetEmpty}>
                <AppText variant="body" muted>
                  No locations are available right now.
                </AppText>
              </View>
            ) : null}

            {locations.length > 0 ? (
              <FlatList
                data={locations}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  const selected = item.id === selectedLocationId;
                  return (
                    <View>
                      <AppPressable
                        onPress={() => onSelect(item)}
                        style={({ pressed }) => [
                          styles.locationRow,
                          pressed && styles.rowPressed,
                        ]}>
                        <View style={styles.locationContent}>
                          <AppText variant="body">
                            {item.name ?? item.id}
                          </AppText>
                          {item.locality ? (
                            <AppText variant="caption" muted>
                              {item.locality}
                            </AppText>
                          ) : null}
                        </View>
                        {selected ? (
                          <AppText
                            variant="label"
                            style={{ color: colors.primary }}>
                            ✓
                          </AppText>
                        ) : null}
                      </AppPressable>
                      <AppDivider />
                    </View>
                  );
                }}
              />
            ) : null}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  triggerText: {
    flex: 1,
    minWidth: 0,
  },
  inlineError: {
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 4,
    alignItems: 'flex-start',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    maxHeight: '70%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sheetLoading: {
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  sheetEmpty: {
    padding: 24,
    gap: 12,
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  locationContent: {
    flex: 1,
  },
  rowPressed: {
    opacity: 0.85,
  },
});
