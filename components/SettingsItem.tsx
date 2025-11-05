import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SvgProps } from "react-native-svg";
import ThemedText from "./ThemedText";

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

  // @ts-ignore
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  return (
    <TouchableOpacity
      className={`flex-row gap-2 py-6 ${
        currentTheme === "dark"
          ? "border-b-[.5px] border-b-light/20"
          : "border-b-[.5px] border-b-dark/20"
      } ${className}`}
      onPress={handlePress}
    >
      <Icon width={22} height={22} stroke={textColor} color={textColor} strokeWidth={1} />
      <View className="gap-1">
        <ThemedText className="font-cairo-bold text-sm">{title}</ThemedText>
        <ThemedText className="font-cairo opacity-65 text-sm">
          {desc}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default SettingsItem;
