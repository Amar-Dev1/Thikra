import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import { images } from "@/constants/images";
import Constants from "expo-constants";
import React from "react";
import { Image, Text, View } from "react-native";

const About = () => {
  return (
    <BgWrapper className="px-5 gap-3 bg-bgColor" hideBackground={true}>
      <View className="relative flex-row items-center justify-center py-4 border-b-[.5px] border-b-dark/20">
        <MainTitle title="عن التطبيق" />
      </View>
      <View className="flex-1 gap-8">
        <View className="items-center gap-3">
          <Image
            source={images.icon}
            className="size-32"
            resizeMode="contain"
          />
          <Text className="font-cairo-bold opacity-65 text-md">
            v{Constants.expoConfig?.version}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 ">
          <Text className="font-cairo opacity-75">- اسم التطبيق : </Text>
          <Text className="font-cairo-bold">ذكرى - Thikra</Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Text className="font-cairo opacity-75 mb-auto">- نبذه : </Text>
          <Text className="font-cairo-bold flex-1 opacity-65">
            هو تطبيق إسلامي لإعانة المسلم -
            <Text className="font-cairo-bold text-green-700">
              الموحّد لله عز و جل{" "}
            </Text>
            - على تتبع أوقات الصلاة بناءاً على موقعه و قراءة الأذكار و الأدعية،
            بالإضافة لأشياء أخرى
          </Text>
        </View>

      </View>
    </BgWrapper>
  );
};

export default About;