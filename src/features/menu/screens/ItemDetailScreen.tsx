import React from 'react';
import { View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MenuStackParamList } from '@/app/navigation/types';
import { AppScreen, AppText } from '@/shared/components/ui';

type Props = NativeStackScreenProps<MenuStackParamList, 'ItemDetail'>;

export function ItemDetailScreen({ route }: Props) {
  const { itemId } = route.params;

  return (
    <AppScreen edges={['left', 'right', 'bottom']}>
      <View style={{ flex: 1, padding: 20, justifyContent: 'center', gap: 12 }}>
        <AppText variant="title">Item detail</AppText>
        <AppText variant="body" muted>
          Item ID: {itemId}
        </AppText>
        <AppText variant="caption" muted>
          Placeholder screen — connect GET /api/items/:itemId in the next step.
        </AppText>
      </View>
    </AppScreen>
  );
}
