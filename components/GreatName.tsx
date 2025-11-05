import { useTheme } from "@/context/ThemeContext";
import { IGreatName } from "@/interfaces";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

const GreatName = ({ name, className, onPress }: IGreatName) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";

  return (
    <TouchableOpacity
      className={`p-2 bg-primary rounded-2xl border ${
        currentTheme === "dark" ? "border-dark/10" : "border-gray-400"
      }  ${className}`}
      onPress={onPress}
      style={{ backgroundColor: bg }}
    >
      <View
        className={`flex-1 rounded-2xl flex-row justify-center items-center p-3 ${
          currentTheme === "dark" ? "bg-[#333333]" : "bg-accent"
        }`}
      >
        <ThemedText className="font-cairo-bold text-sm">{name}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default GreatName;
