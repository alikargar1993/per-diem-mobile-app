import React, { useCallback, useState } from 'react';
import {
  Image,
  View,
  type ImageProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export type AppImageProps = Omit<ImageProps, 'source'> & {
  source: ImageProps['source'] | null | undefined;
  fallbackStyle?: StyleProp<ViewStyle>;
};

export function AppImage({
  source,
  style,
  fallbackStyle,
  onError,
  ...rest
}: AppImageProps) {
  const { colors } = useAppTheme();
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(
    (e: Parameters<NonNullable<ImageProps['onError']>>[0]) => {
      setFailed(true);
      onError?.(e);
    },
    [onError],
  );

  if (!source || failed) {
    return (
      <View
        style={[
          {
            backgroundColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
          fallbackStyle,
        ]}
      />
    );
  }

  return (
    <Image {...rest} source={source} style={style} onError={handleError} />
  );
}
