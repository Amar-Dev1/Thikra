import { images } from "@/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";
import ViewShot from "react-native-view-shot";

interface props {
  duaName: string;
  firstDua: string;
  count?: number;
  ref: React.Ref<ViewShot>;
}

const ShareDua = ({ duaName, ref, firstDua, count }: props) => {
  return (
    <ViewShot ref={ref} options={{ format: "png", quality: 0.9 }}>
      <View className="bg-dark/50 justify-center py-8 px-5 gap-12 rounded-xl h-[450px]">
        <View className="gap-5 items-center">
          <Text className="text-light text-lg font-cairo-bold">{duaName}</Text>
        </View>
        <View className="flex-1 bg-[#222222] rounded-2xl p-5 gap-4 items-center justify-center">
          <Text className="text-light font-cairo text-xs text-center">
            {firstDua}
          </Text>
          <Text className="text-[8px] font-cairo text-light opacity-65">
            المرات : {count}
          </Text>
        </View>
        <View className="gap-3 items-center">
          <Image
            source={images.splashIcon}
            resizeMode="contain"
            className="w-8 h-8"
          />
          <Text className="text-center font-cairo text-light text-sm">
            Thikra app
          </Text>
        </View>
      </View>
    </ViewShot>
  );
};

export default ShareDua;
