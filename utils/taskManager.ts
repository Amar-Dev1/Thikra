import { IPrayerDetails } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { schedulePrayerNotification } from "./schedulePrayerNotification";
import { syncNotificationState } from "./syncNotificationState";

export const fireBackgroundNotification = async () => {
  try {
    const storedTimings = await AsyncStorage.getItem("timings");
    const timings: IPrayerDetails[] = storedTimings
      ? JSON.parse(storedTimings)
      : [];

    await schedulePrayerNotification(timings);
    await syncNotificationState(timings);
  } catch (e) {
    console.warn(e);
  }
};