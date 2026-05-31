import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ItemDetailScreen } from '@/features/menu/screens/ItemDetailScreen';
import { MenuListScreen } from '@/features/menu/screens/MenuListScreen';
import type { MenuStackParamList } from '@/app/navigation/types';
import { ThemeHeaderButton } from '@/shared/components/ThemeHeaderButton';
import { useAppTheme } from '@/shared/theme/ThemeContext';

const Stack = createNativeStackNavigator<MenuStackParamList>();

export function MenuStackNavigator() {
  const { colors, isDark } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: !isDark,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen
        name="MenuList"
        component={MenuListScreen}
        options={{
          title: 'Menu',
          headerRight: () => <ThemeHeaderButton />,
        }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetailScreen}
        options={{ title: 'Item' }}
      />
    </Stack.Navigator>
  );
}
