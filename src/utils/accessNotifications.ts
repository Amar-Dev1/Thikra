import notifee, {
  AndroidNotificationSetting,
  AuthorizationStatus,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Platform } from "react-native";
import i18n from "../i18n";

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
        i18n.t("common.permission_denied"),
        i18n.t("common.permission_denied_desc")
      );
      await AsyncStorage.removeItem(FLAG);
      return false;
    }

    await AsyncStorage.setItem(FLAG, "true");

    if (Platform.OS === "android") {
      const alarmSettings = await notifee.getNotificationSettings();
      if (alarmSettings.android.alarm !== AndroidNotificationSetting.ENABLED) {
        Alert.alert(
          i18n.t("common.permission_required"),
          i18n.t("common.permission_required_desc"),
          [
            { text: i18n.t("common.later"), style: "cancel" },
            {
              text: i18n.t("common.open_settings"),
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
      i18n.t("common.error"),
      i18n.t("common.notification_setup_error")
    );
    return false;
  }
};
