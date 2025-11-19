import { CONFIG } from "./config";

export const fetchPlayStoreStatus = async () => {
  try {
    const res = await fetch(`${CONFIG.PLAY_STORE_STATUS_URL}`);
    if (!res.ok) throw new Error("Faild to fetch play store status");
    const result = await res.json();
    return result;
  } catch (e) {
    console.log(e);
  }
};
