import { IPrayerDetails } from "@/interfaces";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { convertToHHMM } from "./parseTime";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getOffsetTime = (hour: number, minute: number, offsetMinutes: number) => {
  // Create a base date (the specific date doesn't matter, just the time)
  const date = new Date();
  date.setHours(hour, minute, 0, 0); // Set to the prayer time
  date.setMinutes(date.getMinutes() + offsetMinutes); // Add the offset

  // Return the new hour and minute
  return { hour: date.getHours(), minute: date.getMinutes() };
};

export const schedulePrayerNotification = async (prayers: IPrayerDetails[]) => {
  try {
    const sound = Platform.OS === "android" ? undefined : "sound.wav";

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
          sound: sound,
          // @ts-ignore
          android: {
            channelId: "salah_channel",
          },
        },
        // @ts-ignore
        trigger: {
          hour: hour,
          minute: minute,
          repeats: true,
        },
      });

      console.log(
        `SUCCESS: Scheduled notification for ${prayer.enName} at ${hour}:${minute}`
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
    const { hour: AsrHour, minute: AsrMinute } = convertToHHMM(Asr.time);

    if (!isNaN(fajrHour) && !isNaN(fajrMinute)) {
      const { hour: sabahHour, minute: sabahMinute } = getOffsetTime(
        fajrHour,
        fajrMinute,
        10
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "أذكار الصباح يا مسلم",
          body: "لا تغفل عن أذكار الصباح ، رحمك الله",
          sound: "default",
          // @ts-ignore
          android: {
            channelId: "adhkar_channel",
          },
        },
        // @ts-ignore
        trigger: {
          hour: sabahHour,
          minute: sabahMinute,
          repeats: true,
        },
      });
      console.log(
        `SUCCESS: Scheduled Sabah Adhkar at: ${sabahHour}:${sabahMinute}`
      );
    }

    if (!isNaN(AsrHour) && !isNaN(AsrMinute)) {
      const { hour: MasaHour, minute: MasaMinute } = getOffsetTime(
        AsrHour,
        AsrMinute,
        10
      );

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "أذكار المساء يا مسلم",
          body: "لا تغفل عن أذكار المساء ، رحمك الله",
          sound: "default",
          // @ts-ignore
          android: {
            channelId: "adhkar_channel",
          },
        },
        // @ts-ignore
        trigger: {
          hour: MasaHour,
          minute: MasaMinute,
          repeats: true,
        },
      });
      console.log(
        `SUCCESS: Scheduled Masa Adhkar at: ${MasaHour}:${MasaMinute}`
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

export const syncNotificationState = async () => {
  const FLAG = "notifications_allowed";
  try {
    const { status } = await Notifications.getPermissionsAsync();
    const granted = status === "granted";
    const flag = await AsyncStorage.getItem(FLAG);

    if (granted && flag !== "true") {
      await AsyncStorage.setItem(FLAG, "true");
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
