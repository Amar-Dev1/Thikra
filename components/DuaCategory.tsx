import { IDuaCategory } from "@/interfaces";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const DuaCategory = ({ id, title, className, Icon }: IDuaCategory) => {
  return (
    <TouchableOpacity
      className={`p-2 bg-primary rounded-2xl border border-gray-400 shadow-md ${className}`}
      onPress={() => router.push(`/(tabs)/Dua/${id}`)}
    >
      <View className="flex-1 bg-accent rounded-2xl flex-row justify-center items-center p-6">
        <View className="opacity-75">
          <Icon width={26} height={26} />
        </View>
      </View>
      <Text className="font-cairo text-sm text-center my-2">{title}</Text>
    </TouchableOpacity>
  );
};

export default DuaCategory;
