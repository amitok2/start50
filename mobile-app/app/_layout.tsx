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
    // Enable RTL for Hebrew text on all platforms
    if (!I18nManager.isRTL) {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
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
          headerShown: true,
          headerStyle: {
            backgroundColor: '#FFFFFF',
          },
          headerTintColor: '#0A0A0A',
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerTitleAlign: 'center',
          contentStyle: { backgroundColor: '#FFFFFF' },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            title: '' // Hide (tabs) label
          }}
        />
        <Stack.Screen 
          name="entrepreneurship-hub" 
          options={{ title: 'מרכז יזמות' }}
        />
        <Stack.Screen 
          name="resource-library" 
          options={{ title: 'ספריית משאבים' }}
        />
        <Stack.Screen 
          name="articles" 
          options={{ title: 'מאמרים ותובנות' }}
        />
        <Stack.Screen 
          name="my-bookings" 
          options={{ title: 'הפגישות שלי' }}
        />
        <Stack.Screen 
          name="my-badges" 
          options={{ title: 'התגים שלי' }}
        />
        <Stack.Screen 
          name="personal-goals" 
          options={{ title: 'המטרות שלי' }}
        />
        <Stack.Screen 
          name="social-tinder" 
          options={{ title: 'להכיר חברות' }}
        />
        <Stack.Screen 
          name="cv-linkedin-enhancer" 
          options={{ title: 'שדרוג קו"ח ולינקדאין' }}
        />
        <Stack.Screen 
          name="interview-prep-ai" 
          options={{ title: 'הכנה לראיון עבודה' }}
        />
        <Stack.Screen 
          name="ai-matchmaking" 
          options={{ title: 'התאמה חכמה AI' }}
        />
        <Stack.Screen 
          name="business-startup-checklist" 
          options={{ title: 'צ\'ק-ליסט הקמת עסק' }}
        />
        <Stack.Screen 
          name="business-steps-planner" 
          options={{ title: 'תכנון עסקי חכם' }}
        />
        <Stack.Screen 
          name="budget-planner" 
          options={{ title: 'מתכנן תקציב' }}
        />
        <Stack.Screen 
          name="career-referrals" 
          options={{ title: 'הקריירה שלי' }}
        />
        <Stack.Screen 
          name="my-courses" 
          options={{ title: 'הקורסים שלי' }}
        />
        <Stack.Screen 
          name="messages" 
          options={{ title: 'הודעות' }}
        />
        <Stack.Screen 
          name="recommendation-letters" 
          options={{ title: 'מכתבי המלצה' }}
        />
        <Stack.Screen 
          name="community" 
          options={{ title: 'הקהילה שלנו' }}
        />
        <Stack.Screen 
          name="mentor-profile" 
          options={{ title: 'פרופיל מנטורית' }}
        />
        <Stack.Screen 
          name="booking" 
          options={{ title: 'קביעת פגישה' }}
        />
        <Stack.Screen 
          name="apply-for-membership" 
          options={{ title: 'הצטרפות לקהילה' }}
        />
      </Stack>
    </RootWrapper>
  );
}

