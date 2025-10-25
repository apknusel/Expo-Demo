import { View, type ViewProps, Platform } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors, Radii } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'background' | 'surface' | 'card' | 'elevated';
  rounded?: boolean;
  border?: boolean;
  elevation?: number;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'background',
  rounded = false,
  border = false,
  elevation = 0,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    variant === 'background' ? 'background' : variant === 'surface' ? 'surface' : 'card'
  );

  const borderColor = useThemeColor({}, 'border');
  const shadowStyle =
    elevation > 0
      ? Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          },
          default: { elevation },
        })
      : null;

  return (
    <View
      style={[
        { backgroundColor },
        rounded && { borderRadius: Radii.md },
        border && { borderWidth: 1, borderColor },
        shadowStyle,
        style,
      ]}
      {...otherProps}
    />
  );
}
