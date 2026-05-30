import MenuSvg from '@assets/svg/menu.svg';
import SearchSvg from '@assets/svg/search.svg';
import FavoriteSvg from '@assets/svg/favorite.svg';
import LocationSvg from '@assets/svg/location.svg';

export const svgIconMap = {
  menu: MenuSvg,
  search: SearchSvg,
  favorite: FavoriteSvg,
  location: LocationSvg,
} as const;

export type SvgIconName = keyof typeof svgIconMap;
