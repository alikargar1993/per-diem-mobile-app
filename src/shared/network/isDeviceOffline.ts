import type { NetInfoState } from '@react-native-community/netinfo';

export function isDeviceOffline(state: NetInfoState): boolean {
  if (state.isConnected === false) {
    return true;
  }
  if (state.isInternetReachable === false) {
    return true;
  }
  return false;
}
