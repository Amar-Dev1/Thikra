import BgWrapper from "@/components/BgWrapper";
import { ISavedCategory } from "@/interfaces";
import { fetchPrayerTimes } from "@/services/fetchPrayerTimes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text } from "react-native";

const SetupAll = () => {
  const [loading, setLoading] = useState<boolean | null>(false);

  const prepareData = async () => {
    try {
      setLoading(true);
      const location = await AsyncStorage.getItem("location");
      const { city, country } = JSON.parse(location!);
      const timings = await fetchPrayerTimes(city, country, 3);
      await AsyncStorage.setItem("timings", JSON.stringify(timings));
      console.log(await AsyncStorage.getItem("timings"));
      await AsyncStorage.setItem("onboardingCompleted", "true");
      router.push("/(tabs)");
    } catch (e: any) {
      console.error(e);
      Alert.alert(
        "تفعيل خدمة الموقع",
        "قم بتفعيل الموقع و الإنترنت رجاءاً ليعمل التطبيق ",
        [{ text: "موافق", style: "default" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const prepareSavedScreen = async () => {
    try {
      if (!(await AsyncStorage.getItem("Saved"))) {
        const initialValues: ISavedCategory[] = [
          { id: 1, name: "الأدعية و الأذكار", items: [] },
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
    <BgWrapper className="flex-1 bg-primary px-5 py-3 flex flex-col justify-center items-center gap-5">
      {loading && (
        <>
          <ActivityIndicator size={"large"} color={"black"} />
          <Text className="font-cairo-bold text-lg opacity-65">
            يتم تهيئة التطبيق...
          </Text>
        </>
      )}

      {/* {!loading && err !== null && (
        <Text className="font-cairo-bold text-md text-red-400">{err}</Text>
      )} */}
    </BgWrapper>
  );
};

export default SetupAll;
