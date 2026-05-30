import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export type AppDividerProps = {
  style?: StyleProp<ViewStyle>;
};

export function AppDivider({ style }: AppDividerProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
        style,
      ]}
    />
  );
}
