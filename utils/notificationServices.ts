import { IPrayerDetails } from "@/interfaces";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { convertToHHMM } from "./parseTime";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    minutes + minutesOffset,
    0
  );
  return scheduledDate;
};

export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    const now = new Date();
    const sound = Platform.OS === "android" ? undefined : "sound.wav";

    for (const prayer of prayers) {
      const { hour, minute } = convertToHHMM(prayer.time);

      if (isNaN(hour) || isNaN(minute)) {
        console.warn(
          `Invalid time for current salah ${prayer.enName}: ${prayer.time}`
        );
        continue;
      }

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

export const scheduleAdhkar = async (timings: IPrayerDetails[]) => {
  try {
    const now = new Date();
    const Fajr = timings.find((p) => p.enName === "Fajr");
    const Asr = timings.find((p) => p.enName === "Asr");

    if (!Fajr || !Asr) {
      console.warn("Could not find Fajr or Asr times to schedule Adhkar");
      return;
    }

    const { hour: fajrHour, minute: fajrMinute } = convertToHHMM(Fajr.time);
    const { hour: AsrHour, minute: AsrMinute } = convertToHHMM(Asr.time);

    if (!isNaN(fajrHour) || !isNaN(fajrMinute)) {
      let sabahAdhkarTime = createScheduleDate(fajrHour, fajrMinute, 10);
      if (sabahAdhkarTime < now) {
        sabahAdhkarTime.setDate(sabahAdhkarTime.getDate() + 1);
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "أذكار الصباح يا مسلم",
          body: "لا تغفل عن أذكار الصباح ، رحمك الله",
          sound: "default",
        },
        // @ts-ignore
        trigger: {
          date: sabahAdhkarTime,
          repeats: false,
        },
      });
      console.log(
        `SUCCESS: Scheduled Sabah Adhkar at: ${sabahAdhkarTime.toLocaleString()}`
      );
    }

    if (!isNaN(AsrHour) || !isNaN(AsrMinute)) {
      let masaAdhkarTime = createScheduleDate(AsrHour, AsrMinute, 10);
      if (masaAdhkarTime < now) {
        masaAdhkarTime.setDate(masaAdhkarTime.getDate() + 1);
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "أذكار المساء يا مسلم",
          body: "لا تغفل عن أذكار المساء ، رحمك الله",
          sound: "default",
        },
        // @ts-ignore
        trigger: {
          date: masaAdhkarTime,
          repeats: false,
        },
      });
      console.log(
        `SUCCESS: Scheduled Sabah Adhkar at: ${masaAdhkarTime.toLocaleString()}`
      );
    }
  } catch (e) {
    console.warn(e);
  }
};

export const scheduleAllNotifications = async (timings: IPrayerDetails[]) => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("Canceld all scheduled notifications");

    await schedulePrayerNotification(timings);
    await scheduleAdhkar(timings);

    console.log("All notifications scheduled successfuly !");
  } catch (e) {
    console.warn("Failed to schedule notifications ", e);
  }
};

export const syncNotificationState = async (prayers?: IPrayerDetails[]) => {
  const FLAG = "notifications_allowed";
  try {
    const { status } = await Notifications.getPermissionsAsync();
    const granted = status === "granted";
    const flag = await AsyncStorage.getItem(FLAG);

    if (granted && flag !== "true") {
      await AsyncStorage.setItem(FLAG, "true");
      // Re-schedule ALL notifications, not just prayers
      if (prayers) await scheduleAllNotifications(prayers);
    } else if (!granted && flag === "true") {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(FLAG);
    }
    return granted;
  } catch (e) {
    console.warn(e);
    return false;
  }
};
