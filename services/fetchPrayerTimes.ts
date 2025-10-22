import { CONFIG } from "./config";

export const fetchPrayerTimes = async (
  city: string,
  country: string,
  method: number
) => {
  try {
    const res = await fetch(
      `${CONFIG.API_URL}?city=${city}&country=${country}&method=${method}`,
      { method: "GET", headers: CONFIG.HEADERS }
    );
    if (!res) {
      throw new Error("خطأ في التهيئة. الرجاء التأكد من تشغيل الإنترنت");
    }
    const data = await res.json();

    return data?.data?.timings;
  } catch (e) {
    console.error(e);
  }
};
