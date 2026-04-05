import { ThemeProvider } from "@/src/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { I18nManager, Text as RNText } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import i18n from "../i18n";
(RNText as any).defaultProps = (RNText as any).defaultProps || {};
(RNText as any).defaultProps.style = [{ fontFamily: "Cairo-Regular" }];
import * as updates from "expo-updates";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  const [completedOnboarding, setCompletedOnboarding] = useState<
    boolean | null
  >(null);
  const [isReady, setIsReady] = useState(false);
  const [fontLoaded, fontError] = useFonts({
    "Amiri-Regular": require("../../assets/fonts/Amiri-Regular.ttf"),
    "Amiri-Bold": require("../../assets/fonts/Amiri-Bold.ttf"),
    "Cairo-Bold": require("../../assets/fonts/Cairo-Bold.ttf"),
    "Cairo-Light": require("../../assets/fonts/Cairo-Light.ttf"),
    "Cairo-Regular": require("../../assets/fonts/Cairo-Regular.ttf"),
  });

  // hide splash screen only when fonts are loaded
  useEffect(() => {
    if ((fontLoaded || fontError) && isReady) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded, fontError, isReady]);

  useEffect(() => {
    async function prepareApp() {
      try {
        const storedLang = await AsyncStorage.getItem("userLanguage");
        if (storedLang) {
          i18n.locale = storedLang;
          const isRTL = storedLang === "ar";

          if (I18nManager.isRTL !== isRTL) {
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);
            setTimeout(async () => {
              await updates.reloadAsync();
            }, 100);
            return;
          }
        }

        const storedValue = await AsyncStorage.getItem("onboardingCompleted");

        if (storedValue === null || storedValue === undefined) {
          await AsyncStorage.setItem("onboardingCompleted", "false");
          setCompletedOnboarding(false);
        } else {
          setCompletedOnboarding(storedValue === "true");
        }
      } catch (e) {
        console.warn("Faild prepare app", e);
      } finally {
        setIsReady(true);
      }
    }

    prepareApp();
  }, []);

  useEffect(() => {
    if (!isReady || completedOnboarding === null) {
      return;
    }

    if (!completedOnboarding) {
      router.replace("/onboarding/Language");
    }

    // If completedOnboarding is true, this effect does nothing,
    // and the app will just render the <Stack> as intended.
  }, [isReady, completedOnboarding, router]);

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
        <Stack screenOptions={{ headerShown: false, animation:'fade' }} >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="Settings" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
