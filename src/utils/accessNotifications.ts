import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import notifee, {
  AndroidNotificationSetting,
  AuthorizationStatus,
} from "@notifee/react-native";

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
        "لم يتم السماح",
        "لن نتمكن من إرسال التنبيهات لك إلا بعد السماح بالإشعارات."
      );
      await AsyncStorage.removeItem(FLAG);
      return false;
    }

    await AsyncStorage.setItem(FLAG, "true");

    if (Platform.OS === "android") {
      const alarmSettings = await notifee.getNotificationSettings();
      if (alarmSettings.android.alarm !== AndroidNotificationSetting.ENABLED) {
        Alert.alert(
          "الإذن مطلوب",
          "لضمان عمل تنبيهات الصلاة في وقتها تماماً حتى إذا كان التطبيق مغلقاً، يرجى تفعيل إذن 'التنبيهات والمذكرات' من الإعدادات.",
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
    Alert.alert("حدث خطأ", "حدث خطأ أثناء إعداد الإشعارات.");
    return false;
  }
};
