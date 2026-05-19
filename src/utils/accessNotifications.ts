import notifee, {
  AndroidNotificationSetting,
  AuthorizationStatus,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
export const accessNotifications = async (): Promise<boolean> => {
  const FLAG = "notifications_allowed";
  try {
    const settings = await notifee.requestPermission({
      alert: true,
      sound: true,
      badge: true,
    });

    const granted =
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
    if (!granted) {
      await notifee.cancelAllNotifications();
      Alert.alert(
        "إذن مرفوض",
        "تطبيقنا يحتاج إلى إذن لإرسال الإشعارات إليك. يرجى تمكينها في إعداداتك."
      );
      await AsyncStorage.removeItem(FLAG);
      return false;
    }

    await AsyncStorage.setItem(FLAG, "true");

    if (Platform.OS === "android") {
      const alarmSettings = await notifee.getNotificationSettings();
      if (alarmSettings.android.alarm !== AndroidNotificationSetting.ENABLED) {
        Alert.alert(
          "إذن مطلوب",
          "تطبيقنا يحتاج إلى إذن لإرسال الإشعارات إليك. يرجى تمكينها في إعداداتك.",
          [
            { text: "لاحقاً", style: "cancel" },
            {
              text: "فتح الإعدادات",
              // open settings page!
              onPress: () => notifee.openAlarmPermissionSettings(),
            },
          ]
        );
        return false;
      }
    }

    console.log("All necessary notification permissions are granted.");
    return true;
  } catch (e) {
    console.error("Notification permission check failed:", e);
    Alert.alert(
      "خطأ",
      "حدث خطأ أثناء إعداد الإشعارات"
    );
    return false;
  }
};
