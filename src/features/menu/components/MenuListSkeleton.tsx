import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppTheme } from '@/shared/theme/ThemeContext';

function SkeletonBlock({ width, height }: { width: number | `${number}%`; height: number }) {
  const { colors } = useAppTheme();
  return (
    <View
      style={{
        width,
        height,
        borderRadius: 8,
        backgroundColor: colors.border,
      }}
    />
  );
}

export function MenuListSkeleton() {
  return (
    <View style={styles.container}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.row}>
          <SkeletonBlock width={72} height={72} />
          <View style={styles.content}>
            <SkeletonBlock width="80%" height={18} />
            <View style={styles.gap} />
            <SkeletonBlock width="60%" height={14} />
            <View style={styles.gapSmall} />
            <SkeletonBlock width="30%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  gap: {
    height: 8,
  },
  gapSmall: {
    height: 6,
  },
});
