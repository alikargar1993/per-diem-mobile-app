import NetInfo, { type NetInfoState } from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/shared/components/ui/AppText';
import { useAppTheme } from '@/shared/theme/ThemeContext';

function isDeviceOffline(state: NetInfoState): boolean {
  if (state.isConnected === false) {
    return true;
  }
  if (state.isInternetReachable === false) {
    return true;
  }
  return false;
}

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  useEffect(() => {
    let active = true;
    NetInfo.fetch().then(state => {
      if (active) {
        setOffline(isDeviceOffline(state));
      }
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      if (active) {
        setOffline(isDeviceOffline(state));
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (!offline) {
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
        You are offline. Menu data may be out of date until you reconnect.
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
