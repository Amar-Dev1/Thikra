import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as updates from "expo-updates";
import React, { useState } from "react";
import { I18nManager, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Language = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";

  const [selectedLang, setSelectedLang] = useState(
    i18n.locale === "ar" ? "ar" : "en"
  );

  const handleNext = async () => {
    try {
      const isRTL = selectedLang === "ar";
      await AsyncStorage.setItem("userLanguage", selectedLang);
      i18n.locale = selectedLang;

      if (I18nManager.isRTL !== isRTL) {
        I18nManager.allowRTL(isRTL);
        I18nManager.forceRTL(isRTL);
        setTimeout(async () => {
          await updates.reloadAsync();
        }, 100);
        return;
      }

      router.push("/onboarding/AllowNotification");
    } catch (e) {
      console.warn("Failed to save language", e);
    }
  };

  return (
    <BgWrapper className="px-5">
      <View className="flex-1">
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          <ThemedText className="font-cairo-bold text-3xl my-5">
            {i18n.t("onboarding.language.title")}
          </ThemedText>
          <ThemedText className="font-cairo text-xl opacity-65 mb-10">
            {i18n.t("onboarding.language.desc")}
          </ThemedText>
        </Animated.View>

        <View className="gap-4">
          <TouchableOpacity
            className={`p-5 rounded-2xl border ${
              selectedLang === "ar"
                ? "border-2 border-accent"
                : currentTheme === "dark"
                ? "border-light/10"
                : "border-dark/10"
            }`}
            style={{ backgroundColor: bg }}
            onPress={() => setSelectedLang("ar")}
          >
            <View className="flex-row justify-between items-center">
              <ThemedText
                className={`font-cairo-bold text-lg ${
                  selectedLang === "ar" ? "text-accent" : ""
                }`}
              >
                {i18n.t("onboarding.language.arabic")}
              </ThemedText>
              {selectedLang === "ar" && (
                <View className="w-4 h-4 rounded-full bg-accent" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className={`p-5 rounded-2xl border ${
              selectedLang === "en"
                ? "border-2 border-accent"
                : currentTheme === "dark"
                ? "border-light/10"
                : "border-dark/10"
            }`}
            style={{ backgroundColor: bg }}
            onPress={() => setSelectedLang("en")}
          >
            <View className="flex-row justify-between items-center">
              <ThemedText
                className={`font-cairo-bold text-lg ${
                  selectedLang === "en" ? "text-accent" : ""
                }`}
              >
                {i18n.t("onboarding.language.english")}
              </ThemedText>
              {selectedLang === "en" && (
                <View className="w-4 h-4 rounded-full bg-accent" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mt-auto mb-5">
          <TouchableOpacity
            className={`rounded-2xl py-3 flex-1 border ${
              currentTheme === "dark" ? "border-light/10" : "border-dark/50"
            }`}
            onPress={handleNext}
            style={{ backgroundColor: bg }}
          >
            <ThemedText className="text-lg font-cairo-bold text-center">
              {i18n.t("common.next")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </BgWrapper>
  );
};

export default Language;
