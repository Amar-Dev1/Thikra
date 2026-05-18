import notifee, {
  AndroidImportance,
  AndroidVisibility,
  EventType,
} from "@notifee/react-native";
import { Platform } from "react-native";

export const initializeNotifications = async () => {
  notifee.onForegroundEvent(async ({ type, detail }) => {
    console.log(
      "Foreground event:",
      detail.notification?.title,
      EventType[type]
    );
  });

  if (Platform.OS === "android") {
    // create channel for salah times
    notifee.createChannel({
      id: "salah_channel",
      name: "أوقات الصلاة",
      importance: AndroidImportance.HIGH,
      vibration: true,
      vibrationPattern: [100, 250, 100, 250],
      lightColor: "#FF231F7C",
      sound: "sound",
      visibility: AndroidVisibility.PUBLIC,
    });

    notifee.createChannel({
      id: "adhkar_channel",
      name: "أذكار الصباح والمساء",
      importance: AndroidImportance.DEFAULT,
      sound: "default",
      visibility: AndroidVisibility.PUBLIC,
    });
    console.log("Notifee channels configured.");
  }
};
