import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

import * as Notifications from "expo-notifications";

export const accessNotifications = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "لم يتم السماح",
        "لن نتمكن من إرسال التنبيهات لك إلا بعد السماح بالإشعارات."
      );
      return false;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    await AsyncStorage.setItem("notifications_allowed", "true");
    // router.push("/onboarding/AccessLocation");
    return true;
  } catch (e) {
    console.error("Notification setup failed:", e);
    Alert.alert("حدث خطأ", "حدث خطأ أثناء إعداد الإشعارات.");
    return false;
  }
};
