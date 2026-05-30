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
import { ScreenStatePanel } from '@/shared/components/ScreenStatePanel';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { AppScreen, AppText } from '@/shared/components/ui';
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
  const { results, total, status, error, query } = useAppSelector(
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

  const onRetrySearch = useCallback(() => {
    if (debouncedQuery.length > 0) {
      dispatch(
        performSearch({
          q: debouncedQuery,
          locationId: selectedLocationId ?? undefined,
        }),
      );
    }
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

  const showInitialHint = debouncedQuery.length === 0;
  const showLoading = status === 'loading' && debouncedQuery.length > 0;
  const showError = status === 'failed' && debouncedQuery.length > 0;
  const showEmptyResults =
    status === 'succeeded' && debouncedQuery.length > 0 && total === 0;

  const emptyTitle = useMemo(() => {
    if (showInitialHint) {
      return 'Search the menu';
    }
    if (showEmptyResults) {
      return 'No results found';
    }
    return '';
  }, [showEmptyResults, showInitialHint]);

  const emptyMessage = useMemo(() => {
    if (showInitialHint) {
      return 'Try searching by item name, description, or category — for example, “coffee”.';
    }
    if (showEmptyResults) {
      return `Nothing matched “${query}”. Try a different spelling or a shorter keyword.`;
    }
    return '';
  }, [query, showEmptyResults, showInitialHint]);

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

      {showLoading ? (
        <ScreenStatePanel
          loading
          title="Searching"
          loadingMessage={`Looking for “${debouncedQuery}”…`}
        />
      ) : null}

      {showError ? (
        <ScreenStatePanel
          title="Search failed"
          message={error ?? undefined}
          actionLabel="Try again"
          onAction={onRetrySearch}
        />
      ) : null}

      {!showLoading && !showError && (showInitialHint || showEmptyResults) ? (
        <ScreenStatePanel title={emptyTitle} message={emptyMessage} />
      ) : null}

      {!showLoading && !showError && total > 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <MenuListItem item={item} onOpenItem={onOpenItem} />
          )}
          ListHeaderComponent={
            <View style={styles.resultsHeader}>
              <AppText variant="caption" muted>
                {total} result{total === 1 ? '' : 's'} for “{query}”
              </AppText>
            </View>
          }
        />
      ) : null}
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
});
