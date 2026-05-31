import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export type AppScreenProps = {
  children: React.ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

export function AppScreen({ children, edges, style }: AppScreenProps) {
  const { colors } = useAppTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
