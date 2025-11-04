import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { I18nManager, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Enable RTL for Hebrew text
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      // On Android, we need to reload the app for RTL to take effect
      if (Platform.OS === 'android') {
        // Show a message or handle reload
        console.log('RTL enabled - app needs to be reloaded on Android');
      }
    }

    // Hide splash screen after layout is ready
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        <Stack.Screen name="(tabs)" />
      </Stack>
    </GestureHandlerRootView>
  );
}

