import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootTabParamList } from '@/app/navigation/types';
import { AppScreen, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type Props = BottomTabScreenProps<RootTabParamList, 'SearchTab'>;

export function SearchScreen({ navigation }: Props) {
  const { colors, isDark } = useAppTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Search',
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.primary,
      headerTitleStyle: { color: colors.text },
      headerShadowVisible: !isDark,
    });
  }, [colors.primary, colors.surface, colors.text, isDark, navigation]);

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
        <AppText variant="title">Search menu</AppText>
        <AppText variant="body" muted>
          Search items by name, description, and category. Connect GET /api/search
          in the next step.
        </AppText>
      </View>
    </AppScreen>
  );
}
