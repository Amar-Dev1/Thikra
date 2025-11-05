import BgWrapper from "@/components/BgWrapper";
import ScreenTitle from "@/components/ScreenTitle";
import ThemedText from "@/components/ThemedText";
import { images } from "@/constants/images";
import { useTheme } from "@/context/ThemeContext";
import Constants from "expo-constants";
import React from "react";
import { Image, Text, View } from "react-native";

const About = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ccc" : "#222222";

  return (
    <BgWrapper className="px-5 gap-3 bg-bgColor" hideBackground={true}>
      <ScreenTitle title="عن التطبيق" />

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
            - اسم التطبيق :{" "}
          </ThemedText>
          <ThemedText className="font-cairo-bold">ذكرى - Thikra</ThemedText>
        </View>

        <View className="flex-row items-center gap-3">
          <ThemedText className="font-cairo opacity-75 mb-auto">
            - نبذه :{" "}
          </ThemedText>
          <ThemedText className="font-cairo-bold flex-1 opacity-65">
            هو تطبيق إسلامي لإعانة المسلم -
            <Text className="font-cairo-bold text-green-700">
              الموحّد لله عز و جل{" "}
            </Text>
            - على تتبع أوقات الصلاة بناءاً على موقعه و قراءة الأذكار و الأدعية،
            بالإضافة لأشياء أخرى
          </ThemedText>
        </View>
      </View>
    </BgWrapper>
  );
};

export default About;
