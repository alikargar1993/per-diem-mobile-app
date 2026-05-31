import React from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export type AppTextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

export type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  muted?: boolean;
  style?: StyleProp<TextStyle>;
};

const variantStyles: Record<
  AppTextVariant,
  Pick<TextStyle, 'fontSize' | 'fontWeight' | 'lineHeight'>
> = {
  title: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
  subtitle: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
};

export function AppText({
  variant = 'body',
  muted = false,
  style,
  ...rest
}: AppTextProps) {
  const { colors } = useAppTheme();
  const color = muted ? colors.textMuted : colors.text;

  return (
    <Text
      {...rest}
      style={[{ color, ...variantStyles[variant] }, style]}
    />
  );
}
