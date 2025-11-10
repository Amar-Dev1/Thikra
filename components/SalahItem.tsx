import { View } from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { IPrayerDetails } from "@/interfaces";
import { BellSvg } from "@/constants/icons";
import ThemedText from "./ThemedText";
import { convert24To12 } from "@/utils/parseTime";

interface props extends IPrayerDetails {
  className?: string;
}

const SalahItem = ({ name, time, to, className }: props) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#111111" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const parsedTime = `${convert24To12(to)} - ${convert24To12(time)}`;

  return (
    <View
      className={`p-2 border ${
        currentTheme === "dark"
          ? "bg-[#333333] border-light/10"
          : "bg-accent/50 border-dark/10"
      } rounded-xl`}
    >
      <View
        className={`p-3 flex-row gap-4 rounded-xl ${className}`}
        style={{ backgroundColor: bg }}
      >
        <View>
          <View
            className={`w-8 h-8 rounded-lg flex items-center justify-center p-2 ${
              currentTheme === "dark" ? "bg-[#333333]" : "bg-accent/50"
            }`}
          >
            <BellSvg stroke={textColor} strokeWidth={1} className="w-[50%]" />
          </View>
        </View>

        <View className="flex-col gap-3">
          <ThemedText className="font-cairo-bold text-sm">{name}</ThemedText>
          <View className="gap-1">
            <ThemedText className="font-cairo text-sm opacity-65">
              {parsedTime}
            </ThemedText>
            <ThemedText className="font-cairo text-xs opacity-55">
              {convert24To12(time)} إشعار في
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SalahItem;
