import { IPrayerDetails } from "@/interfaces";
import { fetchAdhanSound } from "@/services/fetchAdhanSound";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { convertToHHMM } from "./parseTime";
// FIX: Updated schedulePrayerNotification function

export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Cancelled all scheduled notifications");

    const now = new Date();

    // This utility is fixed (see Bug #2 below)
    const createScheduleDate = (
      hour: number,
      minutes: number,
      minutesOffset: number = 0
    ) => {
      const scheduledDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour,
        minutes + minutesOffset, // <-- This was the bug
        0
      );

      // If this time is already in the past, schedule it for tomorrow
      if (scheduledDate < now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }
      return scheduledDate;
    };

    const AdhanUri = await fetchAdhanSound(Platform.OS);
    const sound = AdhanUri ? AdhanUri : "default";

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

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `حان الآن موعد أذان ${prayer.name}`,
          body: "إن الصلاة كانت على المؤمنين كتاباً موقوتا",
          sound: sound,
        },
        // Use the explicit Date object as the trigger
        // @ts-ignore
        trigger: {
          date: triggerDate,
          repeats: false,
        },
      });
      // Schedule Adhkar notifications using the fixed utility
      if (prayer.key === 2) {
        // Fajr
        const adhkarTime = createScheduleDate(hour, minute, 10); // 10 mins after Fajr
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "أذكار الصباح يا مسلم",
            body: "لا تغفل عن أذكار الصباح رحمك الله",
            sound: "default",
          },
          // @ts-ignore
          trigger: {
            date: adhkarTime,
            repeats: false,
          },
        });

        console.log(`SUCCESS: Scheduled notification for adhkar alsabah`);
      }

      if (prayer.key === 4) {
        // Asr
        const adhkarTime = createScheduleDate(hour, minute, 10); // 10 mins after Asr
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "أذكار المساء يا مسلم",
            body: "لا تغفل عن أذكار المساء رحمك الله",
            sound: "default",
          },
          // @ts-ignore
          trigger: {
            date: adhkarTime,
            repeats: false,
          },
        });
        console.log(`SUCCESS: Scheduled notification for adhkar almasa`);
      }

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
