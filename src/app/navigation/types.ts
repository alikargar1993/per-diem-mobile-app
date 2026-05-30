import type { NavigatorScreenParams } from '@react-navigation/native';

export type MenuStackParamList = {
  MenuList: undefined;
  ItemDetail: { itemId: string };
};

export type RootTabParamList = {
  MenuTab: NavigatorScreenParams<MenuStackParamList>;
  SearchTab: undefined;
  FavoritesTab: undefined;
};
