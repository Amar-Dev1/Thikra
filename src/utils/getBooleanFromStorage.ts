import AsyncStorage from "@react-native-async-storage/async-storage";

export const getBooleanFromStorage = async (key: string) => {
  let value = await AsyncStorage.getItem(key);
  return value === "true";
};
