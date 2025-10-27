import * as Battery from 'expo-battery';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Accelerometer, Barometer } from 'expo-sensors';
import * as Sharing from 'expo-sharing';
import { useEffect, useMemo, useState } from 'react';
import { Platform, Image as RNImage, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppHeader } from '@/components/ui/app-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/theme';

export default function FeaturesScreen() {
  // Camera / Sharing
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!res.canceled) setPhotoUri(res.assets[0].uri);
  };
  const sharePhoto = async () => {
    if (!photoUri) return;
    const available = await Sharing.isAvailableAsync();
    if (!available) {
      alert('Sharing is not available on this platform');
      return;
    }
    await Sharing.shareAsync(photoUri);
  };

  // Location
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Location permission is required');
      return;
    }
    const pos = await Location.getCurrentPositionAsync({});
    setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
  };
  const openInMaps = () => {
    if (!coords) return;
    const url =
      Platform.select({
        ios: `http://maps.apple.com/?ll=${coords.latitude},${coords.longitude}`,
        default: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
      }) ?? `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
    Linking.openURL(url);
  };

  // Notifications
  const scheduleNotification = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notification permission is required');
      return;
    }
    await Notifications.scheduleNotificationAsync({
      content: { title: '⏰ Reminder', body: 'This is your 5s reminder!' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 },
    });
    alert('Scheduled a local notification for 5 seconds from now');
  };

  // Sensors (Accelerometer)
  const [accel, setAccel] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener((data) => setAccel(data));
    return () => sub && sub.remove();
  }, []);
  const tiltDeg = useMemo(() => {
    const clamped = Math.max(-1, Math.min(1, accel.x));
    return `${(clamped * 45).toFixed(0)}deg`;
  }, [accel.x]);

  // Barometer
  const [baroAvailable, setBaroAvailable] = useState<boolean | null>(null);
  const [baro, setBaro] = useState<{ pressure: number; relativeAltitude?: number } | null>(null);
  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    Barometer.isAvailableAsync().then(setBaroAvailable);
    sub = Barometer.addListener((data) => setBaro(data));
    return () => sub?.remove();
  }, []);

  // Battery
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryState, setBatteryState] = useState<Battery.BatteryState | null>(null);
  const [lowPower, setLowPower] = useState<boolean | null>(null);
  useEffect(() => {
    let subs: { remove: () => void }[] = [];
    Battery.getBatteryLevelAsync().then(setBatteryLevel);
    Battery.getBatteryStateAsync().then(setBatteryState);
    Battery.isLowPowerModeEnabledAsync().then(setLowPower);

    subs.push(
      Battery.addBatteryLevelListener(({ batteryLevel }) => setBatteryLevel(batteryLevel))
    );
    subs.push(
      Battery.addBatteryStateListener(({ batteryState }) => setBatteryState(batteryState))
    );
    subs.push(Battery.addLowPowerModeListener(({ lowPowerMode }) => setLowPower(lowPowerMode)));

    return () => subs.forEach((s) => s.remove());
  }, []);
  const batteryStateLabel = useMemo(() => {
    switch (batteryState) {
      case Battery.BatteryState.UNPLUGGED:
        return 'Unplugged';
      case Battery.BatteryState.CHARGING:
        return 'Charging';
      case Battery.BatteryState.FULL:
        return 'Full';
      case Battery.BatteryState.UNKNOWN:
      default:
        return 'Unknown';
    }
  }, [batteryState]);

  // Biometrics
  const [authResult, setAuthResult] = useState<string | null>(null);
  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!hasHardware || !enrolled) {
      setAuthResult('No biometric hardware or no biometrics enrolled');
      return;
    }
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate',
      cancelLabel: 'Cancel',
      fallbackLabel: 'Use Passcode',
      disableDeviceFallback: false,
    });
    setAuthResult(res.success ? 'Authenticated ✅' : `Failed: ${res.error || 'Unknown error'}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AppHeader title="Features" />
      <ThemedText type="muted" style={{ marginBottom: 8 }}>
        Cross‑platform APIs with graceful fallbacks.
      </ThemedText>

        <Card title="Camera + Share" subtitle="Capture a photo and share it">
          <View style={styles.row}>
            <Button title="Capture photo" onPress={takePhoto} />
            <Button title="Share" onPress={sharePhoto} variant="outline" />
          </View>
          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} contentFit="cover" />
          )}
          <ThemedText type="caption">
            Uses expo-image-picker and expo-sharing. Sharing may be unavailable on web.
          </ThemedText>
        </Card>

        <Card title="Find me (Location)" subtitle="Get coordinates and open Maps">
          <View style={styles.row}>
            <Button title="Get location" onPress={getLocation} />
            <Button title="Open in Maps" onPress={openInMaps} variant="outline" />
          </View>
          <ThemedText>
            {coords
              ? `Latitude: ${coords.latitude.toFixed(5)}, Longitude: ${coords.longitude.toFixed(5)}`
              : 'No location yet'}
          </ThemedText>
          <ThemedText type="caption">Uses expo-location; opens native or Google Maps.</ThemedText>
        </Card>

      {/* Notifications */}
      <Card title="Remind me in 5s (Only works in Dev Build)">
        <Button title="Schedule notification" onPress={scheduleNotification} />
        <ThemedText style={styles.caption}>
          Uses expo-notifications; permissions prompted as needed.
        </ThemedText>
      </Card>

        <Card title="Shake/Wave (Accelerometer)" subtitle="Live sensor readings">
          <View style={styles.sensorRow}>
            <ThemedText>x: {accel.x.toFixed(2)}</ThemedText>
            <ThemedText>y: {accel.y.toFixed(2)}</ThemedText>
            <ThemedText>z: {accel.z.toFixed(2)}</ThemedText>
          </View>
          <ThemedView style={styles.emojiCard}>
            <RNImage
              source={{ uri: 'https://twemoji.maxcdn.com/v/latest/svg/1f44b.svg' }}
              style={[styles.emoji, { transform: [{ rotate: tiltDeg }] }]}
            />
            <ThemedText type="caption">Tilt your device to rotate the hand.</ThemedText>
          </ThemedView>
        </Card>

      {/* Barometer */}
      <Card title="Air pressure (Barometer)">
        <ThemedText>
          {baroAvailable === false
            ? 'Barometer not available on this device'
            : baro
            ? `Pressure: ${baro.pressure.toFixed(1)} hPa`
            : 'Waiting for data...'}
        </ThemedText>
        {!!baro?.relativeAltitude && (
          <ThemedText>Relative altitude: {baro.relativeAltitude.toFixed(2)} m</ThemedText>
        )}
        <ThemedText style={styles.caption}>
          Uses expo-sensors Barometer; no special permissions required.
        </ThemedText>
      </Card>

      {/* Battery */}
      <Card title="Battery">
        <ThemedText>
          Level: {batteryLevel != null ? `${Math.round(batteryLevel * 100)}%` : '...'}
        </ThemedText>
        <ThemedText>State: {batteryStateLabel}</ThemedText>
        {lowPower != null && <ThemedText>Low Power Mode: {lowPower ? 'On' : 'Off'}</ThemedText>}
        <ThemedText style={styles.caption}>Uses expo-battery; no permissions required.</ThemedText>
      </Card>

      {/* Biometrics */}
      <Card title="Authenticate (Biometrics)">
        <Button title="Authenticate" onPress={authenticate} />
        {!!authResult && <ThemedText>{authResult}</ThemedText>}
        <ThemedText style={styles.caption}>
          Uses expo-local-authentication (Face ID / Touch ID / Android biometrics).
        </ThemedText>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: Colors.light.background,
  },
  sensorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emojiCard: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  emoji: {
    width: 48,
    height: 48,
  },
  caption: {
    fontSize: 12,
    opacity: 0.8,
  },
});