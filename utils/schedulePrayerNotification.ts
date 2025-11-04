import { IPrayerDetails } from "@/interfaces";
import * as Notifications from "expo-notifications";
import { convertToHHMM } from "./parseTime";


// this function fire the notification , made for prayers notifications
export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Cancelled all scheduled notifications");

    for (const prayer of prayers) {
      const { hour, minute } = convertToHHMM(prayer.time);

      if (isNaN(hour) || isNaN(minute)) {
        console.warn(
          `Invalid time for current salah ${prayer.enName}: ${prayer.time}`
        );
        continue;
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `حان الآن موعد أذان ${prayer.name}`,
          body: "إن الصلاة كانت على المؤمنين كتاباً موقوتا",
          sound: "default",
        },
        // @ts-ignore
        trigger: {
          hour: hour,
          minute: minute,
          repeats: false,
        },
      });
      console.log(
        `SUCCESS: Scheduled notification for ${prayer.enName} at ${hour}:${minute}`
      );
    }
  } catch (e) {
    console.warn("Faild to schedule prayer notifications ", e);
  }
};
