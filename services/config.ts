import constants from "expo-constants";

export const CONFIG = {
  API_URL: constants.expoConfig?.extra?.API_URL,
  ALL_QURAN_URL:constants.expoConfig?.extra?.ALL_QURAN_URL,
  HEADERS: {
    accept: `application/json`,
  },
};