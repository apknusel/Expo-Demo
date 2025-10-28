import { View, type ViewProps } from 'react-native';

import { Radii } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'background' | 'surface' | 'card';
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
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, variant);
  const borderColor = useThemeColor({}, 'border');

  return (
    <View
      style={[
        {
          backgroundColor,
          borderRadius: rounded ? Radii.md : 0,
          borderWidth: border ? 1 : 0,
          borderColor: border ? borderColor : undefined,
          // Simple shadow/elevation; RN ignores shadow* on Android and uses elevation
          ...(elevation
            ? {
                elevation,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: elevation,
                shadowOffset: { width: 0, height: 0.5 * elevation },
              }
            : null),
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
