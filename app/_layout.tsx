import { ThemeProvider } from "@/context/ThemeContext";
import { IPrayerDetails } from "@/interfaces";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { AppState, I18nManager, Text as RNText } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";
import {
  scheduleAllNotifications,
  syncNotificationState,
} from "@/utils/notificationServices";
import { initializeNotifications } from "@/utils/initializeNotifications";

(RNText as any).defaultProps = (RNText as any).defaultProps || {};
(RNText as any).defaultProps.style = [{ fontFamily: "Cairo-Regular" }];

SplashScreen.preventAutoHideAsync();

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

export default function RootLayout() {
  const router = useRouter();

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

  // hide splash screen only when fonts are loaded
  useEffect(() => {
    if ((fontLoaded || fontError) && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, fontError, isReady]);

  useEffect(() => {
    let sub: any;
    async function prepareApp() {
      try {
        // await AsyncStorage.removeItem("onboardingCompleted"); // for testing

        const storedValue = await AsyncStorage.getItem("onboardingCompleted");

        if (storedValue === null || storedValue === undefined) {
          await AsyncStorage.setItem("onboardingCompleted", "false");
          setCompletedOnboarding(false);
        } else {
          setCompletedOnboarding(storedValue === "true");
        }

        // sync notifications permission
        await syncNotificationState();
        sub = AppState.addEventListener("change", (state) => {
          if (state === "active") {
            syncNotificationState();
          }
        });
      } catch (e) {
        console.warn("Faild prepare app", e);
      } finally {
        setIsReady(true);
      }
    }

    prepareApp();

    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!isReady || completedOnboarding === null) {
      return;
    }

    if (!completedOnboarding) {
      router.replace("/onboarding/AllowNotification");
    }

    // If completedOnboarding is true, this effect does nothing,
    // and the app will just render the <Stack> as intended.
  }, [isReady, completedOnboarding, router]);

  // initialize forground notifications features
  useEffect(() => {
    async function init() {
      await initializeNotifications();
    }
    init();
  }, []);

  // register notficiations
  useEffect(() => {
    const registerNotifications = async () => {
      const data = await AsyncStorage.getItem("timings");
      const timings: IPrayerDetails[] = data ? JSON.parse(data) : [];
      await scheduleAllNotifications(timings);
      await syncNotificationState(timings);
    };
    registerNotifications();
  }, []);

  if (
    !(fontLoaded && fontError === null) ||
    !isReady ||
    completedOnboarding === null
  ) {
    return null;
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="GreatNames" options={{ headerShown: false }} />
          <Stack.Screen name="Settings" />
          <Stack.Screen name="Dua" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
