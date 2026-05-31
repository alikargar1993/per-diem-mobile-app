export type ColorPalette = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryContrast: string;
  error: string;
  offlineBanner: string;
  offlineBannerText: string;
};

export const lightColors: ColorPalette = {
  background: '#F7F5F2',
  surface: '#FFFFFF',
  text: '#1C1917',
  textMuted: '#78716C',
  border: '#E7E5E4',
  primary: '#B45309',
  primaryContrast: '#FFFFFF',
  error: '#B91C1C',
  offlineBanner: '#FEF3C7',
  offlineBannerText: '#78350F',
};

export const darkColors: ColorPalette = {
  background: '#0C0A09',
  surface: '#1C1917',
  text: '#FAFAF9',
  textMuted: '#A8A29E',
  border: '#292524',
  primary: '#FBBF24',
  primaryContrast: '#1C1917',
  error: '#FCA5A5',
  offlineBanner: '#422006',
  offlineBannerText: '#FDE68A',
};
