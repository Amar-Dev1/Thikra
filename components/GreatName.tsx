import { IGreatName } from "@/interfaces";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const GreatName = ({ name, className, onPress }: IGreatName) => {
  return (
    <TouchableOpacity
      className={`p-2 bg-primary rounded-2xl border border-gray-400 shadow-md ${className}`}
      onPress={onPress}
    >
      <View className="flex-1 bg-accent rounded-2xl flex-row justify-center items-center p-3">
        <Text className="font-cairo-bold text-sm">{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GreatName;
