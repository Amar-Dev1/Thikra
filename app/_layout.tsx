import { ThemeProvider } from "@/context/ThemeContext";
import { syncNotificationState } from "@/utils/syncNotificationState";
import { fireBackgroundNotification } from "@/utils/taskManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundTask from "expo-background-task";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { useEffect, useState } from "react";
import { AppState, I18nManager, Text as RNText } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

(RNText as any).defaultProps = (RNText as any).defaultProps || {};
(RNText as any).defaultProps.style = [{ fontFamily: "Cairo-Regular" }];

SplashScreen.preventAutoHideAsync();

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

// define tasks for prayer notifications
const PRAYER_BACKGROUND_TASK = "background-notification-task";

TaskManager.defineTask(PRAYER_BACKGROUND_TASK, async () => {
  try {
    await fireBackgroundNotification();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (e) {
    console.warn("Prayer background task failed", e);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

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

  // register the prayer background task
  useEffect(() => {
    async function register() {
      await BackgroundTask.registerTaskAsync(PRAYER_BACKGROUND_TASK, {
        minimumInterval: 60 * 60 * 8,
        // @ts-ignore
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
    register();
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
          <Stack.Screen
            name="MyNotifications"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Settings" />
          <Stack.Screen name="Dua" />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
