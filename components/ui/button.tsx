import { Pressable, Text, ViewStyle } from 'react-native';

import { Colors, Radii, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

export function Button({
  title,
  onPress,
  disabled,
  variant = 'primary',
  style,
}: {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: ViewStyle;
}) {
  const scheme = useColorScheme() ?? 'light';
  const bg =
    variant === 'primary'
      ? Colors[scheme].primary
      : variant === 'secondary'
      ? Colors[scheme].surface
      : 'transparent';

  const color =
    variant === 'primary'
      ? Colors[scheme].primaryForeground
      : Colors[scheme].text;

  const border = variant === 'outline' ? Colors[scheme].border : 'transparent';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: Colors[scheme].border }}
      style={[
        {
          backgroundColor: bg,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          borderRadius: Radii.md,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: border,
          opacity: disabled ? 0.5 : 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      <Text style={{ color, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}