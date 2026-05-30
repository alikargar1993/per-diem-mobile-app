import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { selectLocation } from '@/features/locations/store/locationsSlice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
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
  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  const onSelect = useCallback(
    (location: LocationDto) => {
      dispatch(selectLocation(location.id));
      setOpen(false);
    },
    [dispatch],
  );

  const label = selectedLocation?.name ?? 'Select location';

  return (
    <>
      <AppPressable
        accessibilityRole="button"
        accessibilityLabel="Choose location"
        onPress={() => setOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        <Icon name="location" size={20} color={colors.primary} />
        <View style={styles.triggerText}>
          <AppText variant="caption" muted>
            Location
          </AppText>
          <AppText variant="label" numberOfLines={1}>
            {label}
          </AppText>
        </View>
      </AppPressable>

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
                        <AppText variant="body">{item.name ?? item.id}</AppText>
                        {item.locality ? (
                          <AppText variant="caption" muted>
                            {item.locality}
                          </AppText>
                        ) : null}
                      </View>
                      {selected ? (
                        <AppText variant="label" style={{ color: colors.primary }}>
                          ✓
                        </AppText>
                      ) : null}
                    </AppPressable>
                    <AppDivider />
                  </View>
                );
              }}
            />
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
