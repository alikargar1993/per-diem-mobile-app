import AsyncStorage from '@react-native-async-storage/async-storage';

const NAMESPACE = 'per-diem:';

export function storageKey(key: string): string {
  return `${NAMESPACE}${key}`;
}

export async function getStorageItem(key: string): Promise<string | null> {
  return AsyncStorage.getItem(storageKey(key));
}

export async function setStorageItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(storageKey(key), value);
}

export async function removeStorageItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(storageKey(key));
}
