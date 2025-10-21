import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  I18nManager,
  Text as RNText,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

(RNText as any).defaultProps = (RNText as any).defaultProps || {};
(RNText as any).defaultProps.style = [{ fontFamily: "Cairo-Regular" }];

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Enable RTL layout direction
  I18nManager.forceRTL(true);

  // Allow RTL on Android (optional, but recommended for consistent behavior)
  I18nManager.allowRTL(true);

  const [completedOnboarding, setCompletedOnboarding] = useState<
    boolean | null
  >(null);
  const [isReady, setIsReady] = useState(false);

  const [fontLoaded, fontError] = useFonts({
    "Amiri-Regular": require("../assets/fonts/Amiri-Regular.ttf"),
    "Amiri-Bold": require("../assets/fonts/Amiri-Bold.ttf"),
    "Cairo-Bold": require("../assets/fonts/Cairo-Bold.ttf"),
    "Cairo-Light": require("../assets/fonts/Cairo-Light.ttf"),
    "Cairo-Regular": require("../assets/fonts/Cairo-Regular.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        const value = await AsyncStorage.getItem("onboardingCompleted");
        setCompletedOnboarding(value === "true");
      } catch (e) {
        console.warn("Falid to fetch onboarding status from storage", e);
      } finally {
        setIsReady(true);
      }
    }

    prepareApp();
  }, []);

  // hide splash screen only when fonts are loaded
  useEffect(() => {
    if ((fontLoaded || fontError) && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, fontError, isReady]);

  if ((!fontLoaded && !fontError) || !isReady) {
    return null;
  }

  if (completedOnboarding === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!completedOnboarding) {
    return (
      <Stack screenOptions={{ headerShown: false, statusBarHidden: true }}>
        <Stack.Screen
          name="onboarding/AllowNotification"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboarding/AccessLocation"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboarding/SetupAll"
          options={{ headerShown: false }}
        />
      </Stack>
    );
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ statusBarHidden: true }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="GreatNames" />
        <Stack.Screen name="MyNotification" />
        <Stack.Screen name="Settings" />
        <Stack.Screen name="Dua" />
      </Stack>
    </SafeAreaProvider>
  );
}
