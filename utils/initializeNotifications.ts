import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const initializeNotifications = async () => {
  // 1. setting the forground notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  //   2. creating notification channels for android
  if (Platform.OS === "android") {
    // channel for salah times
    await Notifications.setNotificationChannelAsync("salah_channel", {
      name: "تنبيهات الصلاة",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
      sound: "sound.wav",
    });

    // channel for Adhkar
    await Notifications.setNotificationChannelAsync("adhkar_channel", {
      name: "تنبيهات الأذكار",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: "default",
    });

    console.log("Notification channels configured.");
  }
};