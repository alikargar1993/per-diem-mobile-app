import React from 'react';
import { View } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import { AppPressable } from '@/shared/components/ui/AppPressable';
import { AppText } from '@/shared/components/ui/AppText';

export function ThemeHeaderButton() {
  const { cyclePreference, preference } = useAppTheme();

  const label =
    preference === 'system' ? 'Auto' : preference === 'dark' ? 'Dark' : 'Light';

  return (
    <AppPressable
      accessibilityRole="button"
      accessibilityLabel="Cycle color theme"
      onPress={cyclePreference}
      style={({ pressed }) => ({
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        opacity: pressed ? 0.75 : 1,
      })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <AppText variant="caption">Theme</AppText>
        <AppText variant="label">{label}</AppText>
      </View>
    </AppPressable>
  );
}
