import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';

function Block({
  width,
  height,
  radius = 8,
}: {
  width: number | `${number}%`;
  height: number;
  radius?: number;
}) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        width,
        height,
        borderRadius: radius,
        backgroundColor: colors.border,
      }}
    />
  );
}

export function ItemDetailSkeleton() {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <Block width="100%" height={220} radius={12} />
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>
        <Block width="75%" height={24} />
        <View style={styles.gap} />
        <Block width="35%" height={20} />
        <View style={styles.gap} />
        <Block width="100%" height={14} />
        <View style={styles.gapSmall} />
        <Block width="90%" height={14} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  gap: {
    height: 12,
  },
  gapSmall: {
    height: 8,
  },
});
