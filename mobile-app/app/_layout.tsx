import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { I18nManager, Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding (skip on web)
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

export default function RootLayout() {
  useEffect(() => {
    // Enable RTL for Hebrew text (skip on web for now)
    if (Platform.OS !== 'web' && !I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      // On Android, we need to reload the app for RTL to take effect
      if (Platform.OS === 'android') {
        console.log('RTL enabled - app needs to be reloaded on Android');
      }
    }

    // Hide splash screen after layout is ready
    setTimeout(() => {
      if (Platform.OS !== 'web') {
        SplashScreen.hideAsync();
      }
    }, 1000);
  }, []);

  // Use GestureHandler only on mobile
  const RootWrapper = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <RootWrapper style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </RootWrapper>
  );
}

