import { IPrayerDetails } from "@/interfaces";
import * as Notifications from "expo-notifications";
import { convertToHHMM } from "./parseTime";

// this function fire the notification , made for prayers notifications
export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    // utility for calculating the 'الأذكار' time
    const createScheduleDate = (
      hour: number,
      minutes: number,
      minutesOffset: number = 0
    ) => {
      const now = new Date();
      const scheduledDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        now.getMinutes() + minutesOffset,
        0
      );
      return scheduledDate;
    };

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

      if (prayer.key === 1) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "أذكار الصباح يا مسلم",
            body: "لا تغفل عن أذكار الصباح رحمك الله",
            sound: "default",
          },
          // @ts-ignore
          trigger: {
            hour: createScheduleDate(hour, minute, 10).getHours(),
            minute: createScheduleDate(hour, minute, 10).getMinutes(),
            repeats: false,
          },
        });
      }

      if (prayer.key === 3) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "أذكار المساء يا مسلم",
            body: "لا تغفل عن أذكار المساء رحمك الله",
            sound: "default",
          },
          // @ts-ignore
          trigger: {
            hour: hour,
            minute: minute,
            repeats: false,
          },
        });
      }

      console.log(
        `SUCCESS: Scheduled notification for ${prayer.enName} at ${hour}:${minute}`
      );
      console.log(`${
        prayer.key === 1 &&
        `SUCCESS : Scheduled notification for Adhkar Alsabah`
      }
         ${
           prayer.key === 3 &&
           `SUCCESS : Scheduled notification for Adhkar Alsabah`
         }
        `);
    }
  } catch (e) {
    console.warn("Faild to schedule prayer notifications ", e);
  }
};
