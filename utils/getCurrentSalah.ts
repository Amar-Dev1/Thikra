import { IPrayerDetails } from "@/interfaces";

export const getCurrentSalah = (prayers: IPrayerDetails[]) => {
  if (!prayers || prayers.length === 0) {
    return null;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let activeSalah: IPrayerDetails | null = null;

  for (const prayer of prayers) {
    if (!prayer.time || !prayer.time.includes(":")) {
      continue;
    }

    const [h, m] = prayer.time.split(":").map(Number);
    const prayerMinutes = h * 60 + m;

    if (currentMinutes >= prayerMinutes) {
      activeSalah = prayer;
    }
    if (activeSalah === null) {
      return prayers[prayers.length - 1];
    }
  }

  return activeSalah;

};
