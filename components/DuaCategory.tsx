import { useTheme } from "@/context/ThemeContext";
import { IDuaCategory } from "@/interfaces";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import ThemedText from "./ThemedText";

const DuaCategory = ({ id, title, className, Icon }: IDuaCategory) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#111111" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ccc" : "#222222";

  return (
    <TouchableOpacity
      className={`p-2 rounded-2xl ${
        currentTheme === "dark"
          ? "border-[.5px] border-light/10"
          : "border-[.5px] border-dark/50"
      } 
      ${className}`}
      onPress={() => router.push(`/(tabs)/Dua/${id}`)}
      style={{backgroundColor:bg}}
    >
      <View
        className={`flex-1 rounded-2xl flex-row justify-center items-center p-7
          // ${currentTheme === "dark" ? "bg-[#222222]" : "bg-[#F5C97B]"}
          `}
          
      >
        <View className="opacity-75">
          <Icon width={22} height={22} stroke={textColor}/>
        </View>
      </View>
      <ThemedText className="font-cairo text-sm text-center my-2">
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default DuaCategory;
