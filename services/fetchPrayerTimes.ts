import { ILocation } from "@/interfaces";
import { CONFIG } from "./config";

export const fetchPrayerTimes = async (location: ILocation) => {
  try {
    const apiUrl = `${CONFIG.PRAYER_TIME_URL}/timings?latitude=${location.latitude}&longitude=${location.longitude}&method=${location.method}`;

    const res = await fetch(apiUrl, { method: "GET", headers: CONFIG.HEADERS });
    if (!res) {
      throw new Error("خطأ في التهيئة. الرجاء التأكد من تشغيل الإنترنت");
    }
    const data = await res.json();
    return data?.data?.timings;
  } catch (e) {
    console.error(e);
  }
};
