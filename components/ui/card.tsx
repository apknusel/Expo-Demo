import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radii, Spacing } from '@/constants/theme';

export function Card({
  title,
  subtitle,
  footer,
  children,
}: {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <ThemedView variant="card" rounded border elevation={1} style={{ padding: Spacing.lg }}>
      {!!title && <ThemedText type="subtitle" style={{ marginBottom: 6 }}>{title}</ThemedText>}
      {!!subtitle && <ThemedText type="muted" style={{ marginBottom: 8 }}>{subtitle}</ThemedText>}
      <View style={{ gap: Spacing.sm }}>{children}</View>
      {!!footer && <View style={{ marginTop: Spacing.md }}>{footer}</View>}
    </ThemedView>
  );
}