import React from 'react';
import { ActivityIndicator, View, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import { AppText } from '@/shared/components/ui/AppText';

export type AppLoadingProps = {
  message?: string;
  style?: StyleProp<ViewStyle>;
};

export function AppLoading({ message, style }: AppLoadingProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 24,
        },
        style,
      ]}>
      <ActivityIndicator size="large" color={colors.textMuted} />
      {message ? (
        <AppText variant="caption" muted>
          {message}
        </AppText>
      ) : null}
    </View>
  );
}
