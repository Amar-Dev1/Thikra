import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import { Colors } from "@/src/constants/colors";
import { RightAngleSvg } from "@/src/constants/icons";
import { images } from "@/src/constants/images";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import Constants from "expo-constants";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

const About = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const isDark = currentTheme === "dark";
  const textColor = isDark ? "#E0E0E0" : "#222222";
  const mutedText = isDark ? "#999" : "#666";

  return (
    <BgWrapper className="flex-1">
      <View className="flex-row items-center justify-between px-5 pt-12 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <View style={{ transform: [{ rotate: "180deg" }] }}>
            <RightAngleSvg width={20} height={20} stroke={textColor} />
          </View>
        </TouchableOpacity>
        <ThemedText className="text-xl font-cairo-bold">
          {i18n.t("screens.about.title")}
        </ThemedText>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-8 items-center pt-10">
        <View className="items-center mb-10">
          <Image
            source={images.icon}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <ThemedText
            className="text-2xl font-cairo-bold mt-4"
            style={{ color: Colors.brandBrown }}
          >
            {i18n.t("screens.about.app_name_value")}
          </ThemedText>
          <ThemedText className="font-cairo opacity-60 mt-1">
            v{Constants.expoConfig?.version || "2.5.0"}
          </ThemedText>
        </View>

        <View className="w-full bg-white/50 dark:bg-white/5 p-6 rounded-3xl">
          <ThemedText className="text-center font-cairo leading-7">
            {i18n.t("screens.about.about_value")}
          </ThemedText>
        </View>
      </View>
    </BgWrapper>
  );
};

export default About;
