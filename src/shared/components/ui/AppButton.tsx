import React from 'react';
import { ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';
import { AppPressable } from '@/shared/components/ui/AppPressable';
import { AppText } from '@/shared/components/ui/AppText';

export type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: AppButtonProps) {
  const { colors } = useAppTheme();
  const isPrimary = variant === 'primary';
  const isGhost = variant === 'ghost';

  const backgroundColor = isPrimary
    ? colors.primary
    : isGhost
      ? 'transparent'
      : colors.surface;

  const borderColor = colors.border;
  const textColor = isPrimary ? colors.primaryContrast : colors.text;

  return (
    <AppPressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 48,
          paddingHorizontal: 16,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor,
          borderWidth: isPrimary ? 0 : 1,
          borderColor,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <AppText variant="label" style={{ color: textColor }}>
          {label}
        </AppText>
      )}
    </AppPressable>
  );
}
