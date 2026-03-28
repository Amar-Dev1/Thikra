import { CONFIG } from "./config";

export const fetchPlayStoreStatus = async () => {
  try {
    const url = CONFIG?.PLAY_STORE_STATUS_URL;
    console.log("fetchPlayStoreStatus URL:", url);
    if (!url) {
      console.warn("PLAY_STORE_STATUS_URL is missing");
      return null;
    }

    const res = await fetch(url);
    console.log("fetchPlayStoreStatus response status:", res.status);
    if (!res.ok) throw new Error("Failed to fetch play store status");
    const result = await res.json();
    console.log("fetchPlayStoreStatus result:", result);
    return result;
  } catch (e) {
    console.log(e);
  }
};
