import BgWrapper from "@/src/components/BgWrapper";
import ScreenTitle from "@/src/components/ScreenTitle";
import ThemedText from "@/src/components/ThemedText";
import { images } from "@/src/constants/images";
import i18n from "@/src/i18n";
import Constants from "expo-constants";
import React from "react";
import { Image, Text, View } from "react-native";

const About = () => {
  return (
    <BgWrapper className="px-5 gap-3 bg-bgColor">
      <ScreenTitle title={i18n.t("screens.about.title")} />

      <View className="flex-1 gap-8">
        <View className="items-center gap-3">
          <Image
            source={images.icon}
            className="size-32"
            resizeMode="contain"
          />
          <ThemedText className="font-cairo-bold opacity-65 text-md">
            v{Constants.expoConfig?.version}
          </ThemedText>
        </View>
        <View className="flex-row items-center gap-3 ">
          <ThemedText className="font-cairo opacity-75">
            {i18n.t("screens.about.app_name_label")}
          </ThemedText>
          <ThemedText className="font-cairo-bold">
            {i18n.t("screens.about.app_name_value")}
          </ThemedText>
        </View>

        <View className="flex-row items-center gap-3">
          <ThemedText className="font-cairo opacity-75 mb-auto">
            {i18n.t("screens.about.about_label")}
          </ThemedText>
          <ThemedText className="font-cairo-bold flex-1 opacity-65">
            {i18n.t("screens.about.about_value")}
            <Text className="font-cairo-bold text-green-700">
              {i18n.t("screens.about.monotheist")}
            </Text>
            {i18n.t("screens.about.description_rest")}
          </ThemedText>
        </View>
      </View>
    </BgWrapper>
  );
};

export default About;
