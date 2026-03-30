import { ILocation } from "@/src/interfaces";
import i18n from "../i18n";
import { CONFIG } from "./config";

export const fetchPrayerTimes = async (location: ILocation) => {
  try {
    const apiUrl = `${CONFIG.PRAYER_TIME_URL}/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=${location.method}`;

    const res = await fetch(apiUrl, { method: "GET", headers: CONFIG.HEADERS });
    if (!res) {
      throw new Error(i18n.t("services.prayer_times.initialization_error"));
    }
    const data = await res.json();
    return data?.data?.timings;
  } catch (e) {
    console.error(e);
  }
};
