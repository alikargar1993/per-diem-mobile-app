import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import type { MenuItemDto } from '@/shared/types/api';
import { formatMoney } from '@/features/menu/utils/formatMoney';
import {
  AppDivider,
  AppImage,
  AppPressable,
  AppText,
} from '@/shared/components/ui';

type MenuListItemProps = {
  item: MenuItemDto;
  onOpenItem: (itemId: string) => void;
};

export function MenuListItem({ item, onOpenItem }: MenuListItemProps) {
  const onPress = useCallback(() => {
    onOpenItem(item.id);
  }, [item.id, onOpenItem]);

  return (
    <View>
      <AppPressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
        <AppImage
          source={item.imageUrl ? { uri: item.imageUrl } : null}
          style={styles.image}
        />
        <View style={styles.content}>
          <AppText variant="subtitle" numberOfLines={2}>
            {item.name}
          </AppText>
          {item.description ? (
            <AppText variant="caption" muted numberOfLines={2} style={styles.description}>
              {item.description}
            </AppText>
          ) : null}
          <AppText variant="label" style={styles.price}>
            {formatMoney(item.price)}
          </AppText>
        </View>
      </AppPressable>
      <AppDivider />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  rowPressed: {
    opacity: 0.88,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  description: {
    marginTop: 4,
  },
  price: {
    marginTop: 6,
  },
});
