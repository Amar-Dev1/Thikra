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

SplashScreen.preventAutoHideAsync();

if (i18n.locale === "ar") {
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
    "Amiri-Regular": require("@/assets/fonts/Amiri-Regular.ttf"),
    "Amiri-Bold": require("@/assets/fonts/Amiri-Bold.ttf"),
    "Cairo-Bold": require("@/assets/fonts/Cairo-Bold.ttf"),
    "Cairo-Light": require("@/assets/fonts/Cairo-Light.ttf"),
    "Cairo-Regular": require("@/assets/fonts/Cairo-Regular.ttf"),
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
            // On some platforms, you might need Updates.reloadAsync()
            // but we'll try without it first for simplicity.
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

  // =========== WARNING , UN-comment this after finish !!!!!!!!!!============

  // register notficiations
  // useEffect(() => {
  //   const registerNotifications = async () => {
  //     await initializeNotifications();

  //     const data = await AsyncStorage.getItem("timings");
  //     const timings: IPrayerDetails[] = data ? JSON.parse(data) : [];

  //     if (timings.length === 0) {
  //       console.log("No timings found, skipping notification schedule.");
  //       return;
  //     }

  //     const AllPermissionsGranted = await accessNotifications();
  //     if (AllPermissionsGranted) {
  //       await scheduleAllNotifications(timings);
  //     } else {
  //       console.log("Permissions not fully granted. Skipping schedule.");
  //     }
  //   };
  //   registerNotifications();
  // }, []);
  // =========== WARNING , UN-comment this after finish !!!!!!!!!!============

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

  // useEffect(() => {
  //   const fetchStatus = async () => {
  //     const playStoreStatus = await fetchPlayStoreStatus();

  //     if (!playStoreStatus || typeof playStoreStatus.isPublished !== "boolean")
  //       return;

  //     if (playStoreStatus.isPublished) {
  //       const storeUrl =
  //         playStoreStatus.url && playStoreStatus.url !== "null"
  //           ? playStoreStatus.url
  //           : "https://thikra.netlify.app";

  //       Alert.alert(
  //         i18n.t("onboarding.notification_news_title"),
  //         i18n.t("onboarding.notification_news_desc"),
  //         [
  //           {
  //             text: i18n.t("onboarding.look"),
  //             style: "default",
  //             onPress: () => Linking.openURL(storeUrl),
  //           },
  //           {
  //             text: i18n.t("onboarding.not_interested"),
  //             style: "cancel",
  //           },
  //         ]
  //       );
  //     }
  //   };
  //   fetchStatus();
  // }, []);

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
          <Stack.Screen name="SalahTimes" options={{ headerShown: false }} />
          <Stack.Screen
            name="MyNotifications"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="More" options={{ headerShown: false }} />

          <Stack.Screen name="Settings" />
          <Stack.Screen name="Dua" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
