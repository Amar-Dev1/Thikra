import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";

export interface ISettingsElement {
  title: string;
  desc?: string;
  Icon: React.FC<SvgProps>;
  className?: string;
  onPress?: () => void;
  route?: any;
}

const SettingsItem = ({
  title,
  desc,
  Icon,
  className,
  route,
  onPress,
}: ISettingsElement) => {
  const handlePress = () => {
    if (route) {
      router.push(route);
      return;
    }
    if (typeof onPress === "function") {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      className={`flex-row gap-2 py-6 border-b-[.5px] border-b-dark/20 ${className}`}
      onPress={handlePress}
    >
      <Icon width={24} height={24} />
      <View className="gap-1">
        <Text className="font-cairo-bold text-sm">{title}</Text>
        <Text className="font-cairo opacity-65 text-sm">{desc}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsItem;
