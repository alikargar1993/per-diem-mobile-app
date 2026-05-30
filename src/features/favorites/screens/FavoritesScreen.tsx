import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/app/navigation/types';
import { AppScreen, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type Props = BottomTabScreenProps<RootTabParamList, 'FavoritesTab'>;

export function FavoritesScreen({ navigation }: Props) {
  const { colors, isDark } = useAppTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Favorites',
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.primary,
      headerTitleStyle: { color: colors.text },
      headerShadowVisible: !isDark,
    });
  }, [colors.primary, colors.surface, colors.text, isDark, navigation]);

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
        <AppText variant="body" muted>
          Saved menu items appear here. Favorites persist across app restarts
          via AsyncStorage.
        </AppText>
      </View>
    </AppScreen>
  );
}
