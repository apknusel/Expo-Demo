import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { AppHeader } from '@/components/ui/app-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <AppHeader title="Home" />
      <View style={{ gap: 16 }}>
        <Card title="Welcome" subtitle="This starter now feels like a real app">
          <ThemedText>
            Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          </ThemedText>
          <ThemedText>
            Press{' '}
            <ThemedText type="defaultSemiBold">
              {Platform.select({ ios: 'cmd + d', android: 'cmd + m', web: 'F12' })}
            </ThemedText>{' '}
            to open developer tools.
          </ThemedText>
          <HelloWave />
        </Card>

        <Card title="Try the features" subtitle="Camera, Sharing, Location, Notifications, Sensors, Biometrics">
          <Link href="/features" asChild>
            <Button title="Open Features" variant="primary" />
          </Link>
        </Card>

        <Card title="Explore code" subtitle="Docs and examples">
          <Link href="/explore" asChild>
            <Button title="Explore" variant="outline" />
          </Link>
        </Card>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
