import { IPrayerDetails } from "@/interfaces";
import { fetchPrayerTimes } from "@/services/fetchPrayerTimes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { schedulePrayerNotification } from "./schedulePrayerNotification";
import { syncNotificationState } from "./syncNotificationState";

export const updatedPrayersTimings = async () => {
  try {
    const location = await AsyncStorage.getItem("location");
    const { city, country } = JSON.parse(location!);

    const data = await AsyncStorage.getItem("timings");
    const exsitingTimings: IPrayerDetails[] = data ? JSON.parse(data) : [];

    const fetchTimings = await fetchPrayerTimes(city, country, 3);

    const updated: IPrayerDetails[] = exsitingTimings.map((prayer, index) => {
      const from = fetchTimings[prayer.enName];
      const next = exsitingTimings[(index + 1) % exsitingTimings.length];
      const to = fetchTimings[next.enName] ?? "N/A";
      return {
        ...prayer,
        time: from,
        to,
      };
    });

    await AsyncStorage.setItem("timings", JSON.stringify(updated));

    console.log(
      `SUCCESS : Prayer Timings updated at : ${new Date().toLocaleTimeString()}`
    );
    return updated;
  } catch (e) {
    console.warn(`Faild to update timings, error :`, e);
  }
};

export const fireBackgroundNotification = async () => {
  try {
    const updatedData = await updatedPrayersTimings();
    const timings = updatedData ? updatedData : [];

    await schedulePrayerNotification(timings);
    await syncNotificationState(timings);
  } catch (e) {
    console.warn(e);
  }
};
