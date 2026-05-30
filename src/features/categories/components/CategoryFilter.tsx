import React, { useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { setSelectedCategoryId } from '@/features/menu/store/menuSlice';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { AppPressable, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export function CategoryFilter() {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();

  const categories = useAppSelector(state => state.categories.items);
  const selectedCategoryId = useAppSelector(
    state => state.menu.selectedCategoryId,
  );

  const onSelect = useCallback(
    (categoryId: string | null) => {
      dispatch(setSelectedCategoryId(categoryId));
    },
    [dispatch],
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}>
      <FilterChip
        label="All"
        selected={selectedCategoryId === null}
        onPress={() => onSelect(null)}
        colors={colors}
      />
      {categories.map(category => (
        <FilterChip
          key={category.id}
          label={category.name}
          selected={selectedCategoryId === category.id}
          onPress={() => onSelect(category.id)}
          colors={colors}
        />
      ))}
    </ScrollView>
  );
}

function FilterChip({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: { primary: string; primaryContrast: string; surface: string; border: string; text: string };
}) {
  return (
    <AppPressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surface,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}>
      <AppText
        variant="label"
        style={{ color: selected ? colors.primaryContrast : colors.text }}>
        {label}
      </AppText>
    </AppPressable>
  );
}

const styles = StyleSheet.create({
  scroll: {
    // flexGrow: 0,
    minHeight: 60,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',

  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start'
  },
});
