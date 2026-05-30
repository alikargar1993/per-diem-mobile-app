import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export function CategoryFilterSkeleton() {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.scroll}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={[styles.chip, { backgroundColor: colors.border }]}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    minHeight: 52,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    width: 72,
    height: 36,
    borderRadius: 20,
  },
});
