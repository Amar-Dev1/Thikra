import { RightAngleSvg } from "@/constants/icons";
import { useTheme } from "@/context/ThemeContext";
import { IDuaCategoryItem } from "@/interfaces";
import { router } from "expo-router";
import React from "react";
import { TouchableHighlight, TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

const DuaCategoryItem = ({
  id,
  index,
  name,
  className,
  categoryId,
}: IDuaCategoryItem) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  return (
    <TouchableOpacity
      className={`flex-row items-center py-5 px-3 ${
        currentTheme === "dark"
          ? "border-[.5px] border-light/10"
          : "border-[.5px] border-dark/20"
      } rounded-xl gap-3 ${className}`}
      onPress={() => router.push(`/(tabs)/Dua/${categoryId}/${id}`)}
    >
      <View
        className={`w-8 h-8 justify-center items-center rounded-full opacity-75 ${
          currentTheme === "dark"
            ? "border-[.5px] border-light/20"
            : "border-[.5px] border-dark/20"
        }`}
        style={{ backgroundColor: bg }}
      >
        <ThemedText className="font-cairo text-xs">{index}</ThemedText>
      </View>
      <ThemedText className="font-cairo-bold text-sm flex-1">{name}</ThemedText>
      <TouchableHighlight className="rotate-180">
        <RightAngleSvg width={24} height={24} stroke={textColor} />
      </TouchableHighlight>
    </TouchableOpacity>
  );
};

export default DuaCategoryItem;
