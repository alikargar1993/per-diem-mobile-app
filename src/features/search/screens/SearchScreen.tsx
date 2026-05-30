import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootTabParamList } from '@/app/navigation/types';
import type { MenuStackParamList } from '@/app/navigation/types';
import { MenuListItem } from '@/features/menu/components/MenuListItem';
import {
  performSearch,
  setSearchQuery,
} from '@/features/search/store/searchSlice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { AppLoading, AppScreen, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type SearchNav = CompositeNavigationProp<
  BottomTabScreenProps<RootTabParamList, 'SearchTab'>['navigation'],
  NativeStackNavigationProp<MenuStackParamList>
>;

type Props = BottomTabScreenProps<RootTabParamList, 'SearchTab'>;

const SEARCH_DEBOUNCE_MS = 350;

export function SearchScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useAppTheme();
  const nav = navigation as SearchNav;

  const [inputText, setInputText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const selectedLocationId = useAppSelector(
    state => state.locations.selectedLocationId,
  );
  const { results, total, status, error } = useAppSelector(
    state => state.search,
  );

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

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(inputText.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [inputText]);

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      dispatch(setSearchQuery(''));
      return;
    }
    dispatch(
      performSearch({
        q: debouncedQuery,
        locationId: selectedLocationId ?? undefined,
      }),
    );
  }, [debouncedQuery, dispatch, selectedLocationId]);

  const onOpenItem = useCallback(
    (itemId: string) => {
      nav.navigate('MenuTab', {
        screen: 'ItemDetail',
        params: { itemId },
      });
    },
    [nav],
  );

  const emptyMessage = useMemo(() => {
    if (debouncedQuery.length === 0) {
      return 'Search the menu by item name, description, or category.';
    }
    if (status === 'loading') {
      return null;
    }
    if (status === 'failed') {
      return error ?? 'Search failed. Try again.';
    }
    if (total === 0) {
      return `No results for "${debouncedQuery}".`;
    }
    return null;
  }, [debouncedQuery, error, status, total]);

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <View style={styles.searchBarWrap}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Search menu… e.g. coffee"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
          accessibilityLabel="Search menu"
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
        {selectedLocationId ? (
          <AppText variant="caption" muted style={styles.scopeHint}>
            Results filtered to your selected location.
          </AppText>
        ) : (
          <AppText variant="caption" muted style={styles.scopeHint}>
            Searching the full catalog across all locations.
          </AppText>
        )}
      </View>

      {status === 'loading' && debouncedQuery.length > 0 ? (
        <AppLoading message={`Searching for "${debouncedQuery}"…`} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <MenuListItem item={item} onOpenItem={onOpenItem} />
          )}
          ListHeaderComponent={
            total > 0 ? (
              <View style={styles.resultsHeader}>
                <AppText variant="caption" muted>
                  {total} result{total === 1 ? '' : 's'}
                </AppText>
              </View>
            ) : null
          }
          ListEmptyComponent={
            emptyMessage ? (
              <View style={styles.empty}>
                <AppText variant="body" muted>
                  {emptyMessage}
                </AppText>
              </View>
            ) : null
          }
        />
      )}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  searchBarWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  scopeHint: {
    marginTop: 8,
    paddingHorizontal: 2,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  empty: {
    padding: 24,
  },
});
