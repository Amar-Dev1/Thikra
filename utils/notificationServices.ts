import { IPrayerDetails } from "@/interfaces";
import { Platform } from "react-native";
import { convertToHHMM } from "./parseTime";
import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

const createTriggerDate = (
  hour: number,
  minute: number,
  offset: number = 0
) => {
  const now = new Date();
  const triggerDate = new Date();
  triggerDate.setHours(hour, minute + offset, 0, 0); // Set time for today

  // If the time has already passed today, schedule it for tomorrow
  if (triggerDate.getTime() < now.getTime()) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }
  return triggerDate.getTime(); // Return the timestamp in milliseconds
};

export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    for (const prayer of prayers) {
      const { hour, minute } = convertToHHMM(prayer.time);
      if (isNaN(hour) || isNaN(minute)) {
        console.warn(`Invalid time for ${prayer.enName}: ${prayer.time}`);
        continue;
      }

      const timestamp = createTriggerDate(hour, minute);
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp,
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: {
          allowWhileIdle: true,
        },
      };

      await notifee.createTriggerNotification(
        {
          title: `حان الآن موعد أذان ${prayer.name}`,
          body: "إن الصلاة كانت على المؤمنين كتاباً موقوتا",
          android: {
            channelId: "salah_channel",
            importance: AndroidImportance.HIGH,
            sound: Platform.OS === "android" ? "sound" : undefined,
            pressAction: { id: "default" },
            showTimestamp: true,
          },
          ios: {
            sound: "sound.wav",
          },
        },
        trigger
      );
      console.log(
        `SUCCESS: Scheduled Notifee REPEATING trigger for ${
          prayer.enName
        } at ${new Date(timestamp).toLocaleString()}`
      );
    }
  } catch (e) {
    console.warn("Failed to schedule prayer notifications ", e);
  }
};

export const scheduleAdhkar = async (timings: IPrayerDetails[]) => {
  try {
    const Fajr = timings.find((p) => p.enName === "Fajr");
    const Asr = timings.find((p) => p.enName === "Asr");

    if (!Fajr || !Asr) {
      console.warn("Could not find Fajr or Asr times to schedule Adhkar");
      return;
    }

    const { hour: fajrHour, minute: fajrMinute } = convertToHHMM(Fajr.time);
    const { hour: asrHour, minute: asrMinute } = convertToHHMM(Asr.time);

    // Schedule Sabah Adhkar
    if (!isNaN(fajrHour) && !isNaN(fajrMinute)) {
      const timestamp = createTriggerDate(fajrHour, fajrMinute, 10); // 10 min offset
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp,
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: {
          allowWhileIdle: true, // Also needs to be exact
        },
      };

      await notifee.createTriggerNotification(
        {
          title: "أذكار الصباح يا مسلم",
          body: "لا تغفل عن أذكار الصباح ، رحمك الله",
          android: {
            channelId: "adhkar_channel",
            pressAction: { id: "default" },
            showTimestamp: true,
          },
          ios: {
            sound: "default",
          },
        },
        trigger
      );
      console.log(
        `SUCCESS: Scheduled Sabah Adhkar at: ${new Date(
          timestamp
        ).toLocaleString()}`
      );
    }

    // Schedule Masa Adhkar
    if (!isNaN(asrHour) && !isNaN(asrMinute)) {
      const timestamp = createTriggerDate(asrHour, asrMinute, 10); // 10 min offset
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp,
        repeatFrequency: RepeatFrequency.DAILY,
        alarmManager: {
          allowWhileIdle: true,
        },
      };

      await notifee.createTriggerNotification(
        {
          title: "أذكار المساء يا مسلم",
          body: "لا تغفل عن أذكار المساء ، رحمك الله",
          android: {
            channelId: "adhkar_channel",
            pressAction: { id: "default" },
            showTimestamp: true,
          },
          ios: {
            sound: "default",
          },
        },
        trigger
      );
      console.log(
        `SUCCESS: Scheduled Masa Adhkar at: ${new Date(
          timestamp
        ).toLocaleString()}`
      );
    }
  } catch (e) {
    console.warn(e);
  }
};

export const scheduleAllNotifications = async (timings: IPrayerDetails[]) => {
  try {
    await notifee.cancelAllNotifications();
    console.log("Canceled all scheduled notifications");

    await schedulePrayerNotification(timings);
    await scheduleAdhkar(timings);

    console.log("All Notifee triggers scheduled successfully!");
  } catch (e) {
    console.warn("Failed to schedule notifications ", e);
  }
};
