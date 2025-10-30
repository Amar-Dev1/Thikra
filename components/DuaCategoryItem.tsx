import { RightAngleSvg } from "@/constants/icons";
import { IDuaCategoryItem } from "@/interfaces";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";

const DuaCategoryItem = ({
  id,
  name,
  className,
  categoryId,
}: IDuaCategoryItem) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center py-5 px-3 border border-dark/40 rounded-xl gap-3 ${className}`}
      onPress={() => router.push(`/(tabs)/Dua/${categoryId}/${id}`)}
    >
      <View className="bg-primary w-8 h-8 justify-center items-center rounded-full opacity-75">
        <Text className="font-cairo text-xs">{id}</Text>
      </View>
      <Text className="font-cairo-bold text-sm flex-1">{name}</Text>
      <TouchableHighlight className="rotate-180">
        <RightAngleSvg width={24} height={24} />
      </TouchableHighlight>
    </TouchableOpacity>
  );
};

export default DuaCategoryItem;
