import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MenuStackNavigator } from '@/app/navigation/MenuStackNavigator';
import type { RootTabParamList } from '@/app/navigation/types';
import { FavoritesScreen } from '@/features/favorites/screens/FavoritesScreen';
import { SearchScreen } from '@/features/search/screens/SearchScreen';
import { AppText, Icon } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const { colors, isDark } = useAppTheme();

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
          name="FavoritesTab"
          component={FavoritesScreen}
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color }) => (
              <Icon name="favorite" size={24} color={color} />
            ),
            tabBarLabel: ({ color }) => (
              <AppText variant="caption" style={{ color }}>
                Favorites
              </AppText>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
