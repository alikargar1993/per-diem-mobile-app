import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SvgProps } from 'react-native-svg';
import { svgIconMap, type SvgIconName } from '@/shared/icons/svgAssets';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export type { SvgIconName } from '@/shared/icons/svgAssets';

export type IconProps = {
  name: SvgIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
} & Omit<SvgProps, 'width' | 'height' | 'color'>;

export function Icon({ name, size = 24, color, style, ...svgRest }: IconProps) {
  const { colors } = useAppTheme();
  const SvgIcon = svgIconMap[name];
  const tint = color ?? colors.text;

  return (
    <SvgIcon
      width={size}
      height={size}
      color={tint}
      style={style}
      {...svgRest}
    />
  );
}
