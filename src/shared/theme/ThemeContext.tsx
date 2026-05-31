import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { getStorageItem, setStorageItem } from '@/shared/storage/appStorage';
import { darkColors, lightColors, type ColorPalette } from '@/shared/theme/colors';

const THEME_KEY = 'theme_preference';

export type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  colors: ColorPalette;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  cyclePreference: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function parsePreference(stored: string | null): ThemePreference {
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    let cancelled = false;
    void getStorageItem(THEME_KEY).then(stored => {
      if (!cancelled) {
        setPreferenceState(parsePreference(stored));
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    void setStorageItem(THEME_KEY, value);
  }, []);

  const cyclePreference = useCallback(() => {
    const order: ThemePreference[] = ['system', 'light', 'dark'];
    setPreferenceState(prev => {
      const next = order[(order.indexOf(prev) + 1) % order.length];
      void setStorageItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const isDark =
    preference === 'dark' ||
    (preference === 'system' && systemScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  const value = useMemo(
    () => ({
      colors,
      isDark,
      preference,
      setPreference,
      cyclePreference,
    }),
    [colors, cyclePreference, isDark, preference, setPreference],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useAppTheme must be used within ThemeProvider');
  }
  return ctx;
}
