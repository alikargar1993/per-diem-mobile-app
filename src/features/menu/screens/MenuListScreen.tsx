import React from 'react';
import { View } from 'react-native';
import { AppScreen, AppText } from '@/shared/components/ui';
import { ThemeHeaderButton } from '@/shared/components/ThemeHeaderButton';
import { useAppSelector } from '@/shared/store/hooks';

export function MenuListScreen() {
  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );
  const locationName = useAppSelector(state => {
    const loc = state.locations.items.find(l => l.id === selectedLocationId);
    return loc?.name ?? 'No location selected';
  });

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
        <AppText variant="title">Per Diem Menu</AppText>
        <AppText variant="body" muted>
          Browse the menu by location, category, and meal period. API wiring
          comes in the next step.
        </AppText>
        <AppText variant="subtitle">{locationName}</AppText>
        <ThemeHeaderButton />
      </View>
    </AppScreen>
  );
}
