import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { AppButton, AppLoading, AppText } from '@/shared/components/ui';

export type ScreenStatePanelProps = {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
  loadingMessage?: string;
  style?: StyleProp<ViewStyle>;
};

export function ScreenStatePanel({
  title,
  message,
  actionLabel,
  onAction,
  loading = false,
  loadingMessage,
  style,
}: ScreenStatePanelProps) {
  if (loading) {
    return <AppLoading message={loadingMessage ?? title} style={style} />;
  }

  return (
    <View style={[styles.container, style]}>
      <AppText variant="subtitle">{title}</AppText>
      {message ? (
        <AppText variant="body" muted style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} style={styles.button} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  message: {
    marginTop: 4,
  },
  button: {
    marginTop: 8,
  },
});
