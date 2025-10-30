import { images } from "@/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";
import ViewShot from "react-native-view-shot";

interface props {
  duaName: string;
  ref: React.Ref<ViewShot>;
}

const ShareDua = ({ duaName, ref }: props) => {
  return (
    <ViewShot ref={ref} options={{ format: "png", quality: 0.9 }}>
      <View className="bg-dark/50 justify-center py-8 rounded-xl h-[450px]">
        <View className="flex-1 gap-3 justify-center items-center">
          <Text className="text-light text-lg font-cairo-bold">{duaName}</Text>
          <Text className="text-light font-cairo text-sm opacity-65">
            Dua from Thikra
          </Text>
        </View>
        <View className="mt-auto gap-3 items-center">
          <Image
            source={images.androidForgroundIcon}
            resizeMode="contain"
            className="w-5 h-5"
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
