import constants from "expo-constants";

export const CONFIG = {
  PRAYER_TIME_URL: constants.expoConfig?.extra?.PRAYER_TIME_URL,
  // ALL_QURAN_URL: constants.expoConfig?.extra?.ALL_QURAN_URL,
  SURAH_AUDIO_URL: constants.expoConfig?.extra?.SURAH_AUDIO_URL,
  ADHAN_SOUND_URL:constants.expoConfig?.extra?.ADHAN_SOUND_URL,
  HEADERS: {
    accept: `application/json`,
  },
};
