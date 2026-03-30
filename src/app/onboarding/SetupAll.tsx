import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { ILocation, IPrayerDetails, ISavedCategory } from "@/src/interfaces";
import { fetchPrayerTimes } from "@/src/services/fetchPrayerTimes";
import { accessNotifications } from "@/src/utils/accessNotifications";
import { initializeNotifications } from "@/src/utils/initializeNotifications";
import { scheduleAllNotifications } from "@/src/utils/notificationServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

const SetupAll = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const [loading, setLoading] = useState<boolean | null>(false);

  const [prayersDetails, setPrayersDetails] = useState<IPrayerDetails[]>([
    { key: 1, name: i18n.t("common.fajr"), enName: "Fajr", time: "", to: "" },
    { key: 2, name: i18n.t("common.dhuhr"), enName: "Dhuhr", time: "", to: "" },
    { key: 3, name: i18n.t("common.asr"), enName: "Asr", time: "", to: "" },
    {
      key: 4,
      name: i18n.t("common.maghrib"),
      enName: "Maghrib",
      time: "",
      to: "",
    },
    { key: 5, name: i18n.t("common.isha"), enName: "Isha", time: "", to: "" },
  ]);

  const prepareData = async () => {
    try {
      setLoading(true);

      // prepare location
      const locationData = await AsyncStorage.getItem("location");
      const location: ILocation = locationData
        ? JSON.parse(locationData)
        : null;
      console.log("location: ", location);

      // prepare timings
      const timingsRaw = await fetchPrayerTimes(location);

      const updated: IPrayerDetails[] = prayersDetails.map((prayer, index) => {
        const from = timingsRaw[prayer.enName];
        const next = prayersDetails[(index + 1) % prayersDetails.length];
        const to = timingsRaw[next.enName] ?? "N/A";
        return {
          ...prayer,
          time: from,
          to,
        };
      });
      await AsyncStorage.setItem("timings", JSON.stringify(updated));
      console.log(await AsyncStorage.getItem("timings"));

      await initializeNotifications();
      const granted = await accessNotifications();
      if (granted) await scheduleAllNotifications(updated);

      // mark onboarding as completed ✅
      await AsyncStorage.setItem("onboardingCompleted", "true");
      router.push("/(tabs)");
    } catch (e: any) {
      console.error(e);
      Alert.alert(
        i18n.t("common.location_service_title"),
        i18n.t("common.location_service_desc"),
        [{ text: i18n.t("common.ok"), style: "default" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const prepareSavedScreen = async () => {
    try {
      if (!(await AsyncStorage.getItem("Saved"))) {
        const initialValues: ISavedCategory[] = [
          {
            id: 1,
            name: i18n.t("screens.saved.category_dua_adhkar"),
            items: [],
          },
        ];
        await AsyncStorage.setItem("Saved", JSON.stringify(initialValues));
      }
    } catch (e) {
      console.warn("faild to initialize : Saved screen ! ", e);
    }
  };

  useEffect(() => {
    prepareData();
    prepareSavedScreen();
  }, []);

  return (
    <BgWrapper
      className="flex-1 px-5 py-3 flex flex-col justify-center items-center gap-5"
      style={{ backgroundColor: bg }}
    >
      {loading && (
        <>
          <ActivityIndicator size={"large"} color={textColor} />
          <ThemedText className="font-cairo-bold text-lg opacity-65">
            {i18n.t("common.initializing_app")}
          </ThemedText>
        </>
      )}
    </BgWrapper>
  );
};

export default SetupAll;
