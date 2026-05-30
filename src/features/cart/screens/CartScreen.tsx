import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootTabParamList } from '@/app/navigation/types';
import type { MenuStackParamList } from '@/app/navigation/types';
import { CartLineItemRow } from '@/features/cart/components/CartLineItemRow';
import { clearCart } from '@/features/cart/store/cartSlice';
import {
  computeSubtotal,
  selectTotalQuantity,
} from '@/features/cart/utils/cartTotals';
import { formatMoney } from '@/features/menu/utils/formatMoney';
import { ScreenStatePanel } from '@/shared/components/ScreenStatePanel';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import { AppButton, AppScreen, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type CartNav = CompositeNavigationProp<
  BottomTabScreenProps<RootTabParamList, 'CartTab'>['navigation'],
  NativeStackNavigationProp<MenuStackParamList>
>;

type Props = BottomTabScreenProps<RootTabParamList, 'CartTab'>;

export function CartScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useAppTheme();
  const nav = navigation as CartNav;

  const lines = useAppSelector(state => state.cart.lines);
  const subtotal = useMemo(() => computeSubtotal(lines), [lines]);
  const itemCount = useMemo(() => selectTotalQuantity(lines), [lines]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Cart',
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.primary,
      headerTitleStyle: { color: colors.text },
      headerShadowVisible: !isDark,
    });
  }, [colors.primary, colors.surface, colors.text, isDark, navigation]);

  const onOpenItem = useCallback(
    (itemId: string) => {
      nav.navigate('MenuTab', {
        screen: 'ItemDetail',
        params: { itemId },
      });
    },
    [nav],
  );

  const onClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  if (lines.length === 0) {
    return (
      <AppScreen edges={['left', 'right', 'bottom']}>
        <ScreenStatePanel
          title="Your cart is empty"
          message="Open an item from the menu and tap Add to cart to start an order."
        />
      </AppScreen>
    );
  }

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <FlatList
        data={lines}
        keyExtractor={line => line.itemId}
        renderItem={({ item }) => (
          <CartLineItemRow line={item} onOpenItem={onOpenItem} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <AppText variant="caption" muted>
              {itemCount} item{itemCount === 1 ? '' : 's'} in cart
            </AppText>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}>
        <View style={styles.subtotalRow}>
          <AppText variant="subtitle">Subtotal</AppText>
          <AppText variant="title">{formatMoney(subtotal)}</AppText>
        </View>
        <AppText variant="caption" muted style={styles.footerNote}>
          Prices before tax. Payment is not connected in this demo.
        </AppText>
        <AppButton
          label="Clear cart"
          variant="ghost"
          onPress={onClearCart}
          style={styles.clearButton}
        />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  subtotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerNote: {
    marginTop: 2,
  },
  clearButton: {
    marginTop: 4,
  },
});
