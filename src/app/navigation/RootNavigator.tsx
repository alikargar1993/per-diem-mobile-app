import React, { useMemo } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuStackNavigator } from '@/app/navigation/MenuStackNavigator';
import type { RootTabParamList } from '@/app/navigation/types';
import { CartScreen } from '@/features/cart/screens/CartScreen';
import { selectTotalQuantity } from '@/features/cart/utils/cartTotals';
import { SearchScreen } from '@/features/search/screens/SearchScreen';
import { useAppSelector } from '@/shared/store/hooks';
import { AppText, Icon } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { colors, isDark } = useAppTheme();
  const cartLines = useAppSelector(state => state.cart.lines);
  const cartBadge = useMemo(
    () => selectTotalQuantity(cartLines),
    [cartLines],
  );

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        }}>
        <Tab.Screen
          name="MenuTab"
          component={MenuStackNavigator}
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => (
              <Icon name="menu" size={24} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <AppText variant="caption" style={{ color }}>
                Menu
              </AppText>
            ),
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchScreen}
          options={{
            title: 'Search',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <Icon name="search" size={24} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <AppText variant="caption" style={{ color }}>
                Search
              </AppText>
            ),
          }}
        />
        <Tab.Screen
          name="CartTab"
          component={CartScreen}
          options={{
            title: 'Cart',
            headerShown: true,
            tabBarBadge: cartBadge > 0 ? cartBadge : undefined,
            tabBarIcon: ({ color }) => (
              <Icon name="cart" size={24} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <AppText variant="caption" style={{ color }}>
                Cart
              </AppText>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
