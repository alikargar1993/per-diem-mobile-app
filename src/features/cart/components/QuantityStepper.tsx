import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppPressable, AppText } from '@/shared/components/ui';
import { useAppTheme } from '@/shared/theme/ThemeContext';

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minQuantity?: number;
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  minQuantity = 0,
}: QuantityStepperProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <AppPressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        onPress={onDecrement}
        disabled={quantity <= minQuantity}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            opacity: quantity <= minQuantity ? 0.4 : pressed ? 0.75 : 1,
          },
        ]}>
        <AppText variant="subtitle">−</AppText>
      </AppPressable>
      <AppText variant="subtitle" style={styles.quantity}>
        {quantity}
      </AppText>
      <AppPressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        onPress={onIncrement}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
            opacity: pressed ? 0.75 : 1,
          },
        ]}>
        <AppText variant="subtitle">+</AppText>
      </AppPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    minWidth: 24,
    textAlign: 'center',
  },
});
