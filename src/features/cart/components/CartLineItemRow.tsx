import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from '@/features/cart/store/cartSlice';
import type { CartLine } from '@/features/cart/types/cart.types';
import { computeLineTotal } from '@/features/cart/utils/cartTotals';
import { formatMoney } from '@/features/menu/utils/formatMoney';
import { QuantityStepper } from '@/features/cart/components/QuantityStepper';
import { useAppDispatch } from '@/shared/store/hooks';
import {
  AppDivider,
  AppImage,
  AppPressable,
  AppText,
} from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type CartLineItemProps = {
  line: CartLine;
  onOpenItem?: (itemId: string) => void;
};

export function CartLineItemRow({ line, onOpenItem }: CartLineItemProps) {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const lineTotal = computeLineTotal(line);

  const onIncrement = useCallback(() => {
    dispatch(incrementQuantity(line.itemId));
  }, [dispatch, line.itemId]);

  const onDecrement = useCallback(() => {
    dispatch(decrementQuantity(line.itemId));
  }, [dispatch, line.itemId]);

  const onRemove = useCallback(() => {
    dispatch(removeFromCart(line.itemId));
  }, [dispatch, line.itemId]);

  const onPress = useCallback(() => {
    onOpenItem?.(line.itemId);
  }, [line.itemId, onOpenItem]);

  return (
    <View>
      <View style={styles.row}>
        <AppPressable
          onPress={onPress}
          disabled={!onOpenItem}
          style={({ pressed }) => [
            styles.info,
            onOpenItem && pressed ? styles.infoPressed : null,
          ]}>
          <AppImage
            source={line.imageUrl ? { uri: line.imageUrl } : null}
            style={styles.image}
          />
          <View style={styles.details}>
            <AppText variant="subtitle" numberOfLines={2}>
              {line.name}
            </AppText>
            <AppText variant="caption" muted style={styles.unitPrice}>
              {formatMoney(line.price)} each
            </AppText>
            <AppText variant="label" style={styles.lineTotal}>
              {formatMoney(lineTotal)}
            </AppText>
          </View>
        </AppPressable>
        <View style={styles.controls}>
          <QuantityStepper
            quantity={line.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            minQuantity={1}
          />
          <AppPressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${line.name} from cart`}
            onPress={onRemove}
            style={({ pressed }) => [
              styles.removeButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}>
            <AppText variant="caption" style={{ color: colors.error }}>
              Remove
            </AppText>
          </AppPressable>
        </View>
      </View>
      <AppDivider />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minWidth: 0,
  },
  infoPressed: {
    opacity: 0.85,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  unitPrice: {
    marginTop: 4,
  },
  lineTotal: {
    marginTop: 6,
  },
  controls: {
    alignItems: 'flex-end',
    gap: 8,
  },
  removeButton: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
