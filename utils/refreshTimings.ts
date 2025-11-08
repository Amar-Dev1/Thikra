import { ILocation, IPrayerDetails } from "@/interfaces";
import { fetchPrayerTimes } from "@/services/fetchPrayerTimes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const refreshTimings = async (
  location: ILocation,
  prayers: IPrayerDetails[]
) => {
  try {
    const timingsRaw = await fetchPrayerTimes(location);

    const updated: IPrayerDetails[] = prayers.map((prayer, index) => {
      const from = timingsRaw[prayer.enName];
      const next = prayers[(index + 1) % prayers.length];
      const to = timingsRaw[next.enName] ?? "N/A";
      return {
        ...prayer,
        time: from,
        to,
      };
    });
    await AsyncStorage.setItem("timings", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.log(e);
    return null;
  }
};
