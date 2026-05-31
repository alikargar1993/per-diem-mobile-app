import MenuSvg from '@assets/svg/menu.svg';
import SearchSvg from '@assets/svg/search.svg';
import CartSvg from '@assets/svg/cart.svg';
import LocationSvg from '@assets/svg/location.svg';

export const svgIconMap = {
  menu: MenuSvg,
  search: SearchSvg,
  cart: CartSvg,
  location: LocationSvg,
} as const;

export type SvgIconName = keyof typeof svgIconMap;
