import React from 'react';
import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export type AppPressableProps = Omit<PressableProps, 'style'> & {
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
};

export function AppPressable({ style, ...rest }: AppPressableProps) {
  return (
    <Pressable
      {...rest}
      style={state => (typeof style === 'function' ? style(state) : style)}
    />
  );
}
