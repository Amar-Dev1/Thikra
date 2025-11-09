import { IPrayerDetails } from "@/interfaces";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { convertToHHMM } from "./parseTime";

export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Cancelled all scheduled notifications");

    const now = new Date();

    for (const prayer of prayers) {
      const { hour, minute } = convertToHHMM(prayer.time);

      if (isNaN(hour) || isNaN(minute)) {
        console.warn(
          `Invalid time for current salah ${prayer.enName}: ${prayer.time}`
        );
        continue;
      }

      // --- START OF NEW LOGIC ---
      const triggerDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minute,
        0
      );

      // If the prayer time has already passed today, schedule it for tomorrow
      if (triggerDate < now) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }
      // --- END OF NEW LOGIC ---

      const sound = Platform.OS === "android" ? undefined : "sound.wav";

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `حان الآن موعد أذان ${prayer.name}`,
          body: "إن الصلاة كانت على المؤمنين كتاباً موقوتا",
          sound: sound,
        },
        // @ts-ignore
        trigger: {
          date: triggerDate,
          repeats: false,
        },
        android: {
          channelId: "salah_channel",
        },
      });

      console.log(
        `SUCCESS: Scheduled notification for ${
          prayer.enName
        } at ${triggerDate.toLocaleString()}`
      );
    }
  } catch (e) {
    console.warn("Failed to schedule prayer notifications ", e);
  }
};
