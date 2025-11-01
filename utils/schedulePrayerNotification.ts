import { IPrayerDetails } from "@/interfaces";
import * as Notifications from "expo-notifications";
import { accessNotifications } from "./accessNotifications";
import { getCurrentSalah } from "./getCurrentSalah";
import { convertToHHMM } from "./parseTime";

export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    const allowed = await accessNotifications();
    if (!allowed) {
      console.log("cannot schedule notifications, permission denied !");
    }

    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Cancelled all scheduled notifications");

    const current = getCurrentSalah(prayers);
    if (!current) {
      console.warn("No salah found, skipping scheduling.");
      return;
    }

    const { hour, minute } = convertToHHMM(current.time);

    if (isNaN(hour) || isNaN(minute)) {
      console.warn(
        `Invalid time for current salah ${current.enName}: ${current.time}`
      );
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `حان الآن موعد أذان ${current.name}`,
        body: "إن الصلاة كانت على المؤمنين كتاباً موقوتا",
        sound: "default",
      },
      // @ts-ignore
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true,
      },
    });
    console.log(
      `Scheduled notification for ${current.enName} at ${hour}:${minute}`
    );
  } catch (e) {
    console.warn("Faild to schedule prayer notifications ", e);
  }
};
