import { View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export function AppHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <ThemedView variant="background" style={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText type="title">{title}</ThemedText>
        {right}
      </View>
    </ThemedView>
  );
}