import { IPrayerDetails } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Notifications from "expo-notifications";
import { schedulePrayerNotification } from "./schedulePrayerNotification";

// this function sync the stored permission with the actual permission.
export const syncNotificationState = async (prayers?: IPrayerDetails[]) => {
  const FLAG = "notifications_allowed";
  try {
    const { status } = await Notifications.getPermissionsAsync();
    const granted = status === "granted";
    const flag = await AsyncStorage.getItem(FLAG);

    if (granted && flag !== "true") {
      await AsyncStorage.setItem(FLAG, "true");
      if (prayers) await schedulePrayerNotification(prayers);
    } else if (!granted && flag === "true") {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(FLAG);
    }

    // else if (granted && flag === "true" && prayers) {
    //   await schedulePrayerNotification(prayers);
    // }

    return granted;
  } catch (e) {
    console.warn(e);
    return false;
  }
};
