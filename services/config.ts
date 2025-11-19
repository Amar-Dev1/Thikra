import constants from "expo-constants";

export const CONFIG = {
  PRAYER_TIME_URL: constants.expoConfig?.extra?.PRAYER_TIME_URL,
  // ALL_QURAN_URL: constants.expoConfig?.extra?.ALL_QURAN_URL,
  SURAH_AUDIO_URL: constants.expoConfig?.extra?.SURAH_AUDIO_URL,
  PLAY_STORE_STATUS_URL: constants.expoConfig?.extra?.PLAY_STORE_STATUS_URL,
  HEADERS: {
    accept: `application/json`,
  },
};
