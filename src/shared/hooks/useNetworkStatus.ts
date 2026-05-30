import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { isDeviceOffline } from '@/shared/network/isDeviceOffline';

export function useNetworkStatus(): { isOffline: boolean } {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let active = true;
    NetInfo.fetch().then(state => {
      if (active) {
        setIsOffline(isDeviceOffline(state));
      }
    });
    const unsubscribe = NetInfo.addEventListener(state => {
      if (active) {
        setIsOffline(isDeviceOffline(state));
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  return { isOffline };
}
