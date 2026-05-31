import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { AppText } from '@/shared/components/ui/AppText';
import { useAppTheme } from '@/shared/theme/ThemeContext';

export function OfflineBanner() {
  const { isOffline } = useNetworkStatus();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  if (!isOffline) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: colors.offlineBanner,
          paddingTop: insets.top + 8,
        },
      ]}>
      <AppText
        variant="caption"
        style={[styles.message, { color: colors.offlineBannerText }]}>
        You are offline. Showing saved locations, categories, and menu items.
        Search is unavailable until you reconnect.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  message: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
