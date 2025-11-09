import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";

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

    // if (Platform.OS === "android") {
    //   await Notifications.setNotificationChannelAsync("salah_channel", {
    //     name: "Salah Notifications",
    //     importance: Notifications.AndroidImportance.MAX,
    //     sound: "sound",
    //   });

    //   await Notifications.setNotificationChannelAsync("default_channel", {
    //     name: "default channel",
    //     importance: Notifications.AndroidImportance.MAX,
    //     sound: "default",
    //   });
    // }

    await AsyncStorage.setItem("notifications_allowed", "true");
    return true;
  } catch (e) {
    console.error("Notification setup failed:", e);
    Alert.alert("حدث خطأ", "حدث خطأ أثناء إعداد الإشعارات.");
    return false;
  }
};
