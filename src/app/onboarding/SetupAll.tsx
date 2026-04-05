import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

const SetupAll = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const [loading, setLoading] = useState<boolean | null>(false);

  const prepareData = async () => {
    try {
      setLoading(true);

      // mark onboarding as completed ✅
      await AsyncStorage.setItem("onboardingCompleted", "true");
      router.push("/(tabs)");
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    prepareData();
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
