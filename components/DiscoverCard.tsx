import { useTheme } from "@/context/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity } from "react-native";
import ThemedText from "./ThemedText";

interface props {
  id?: any;
  title: string;
  image: any;
  route?: any;
  className?: string;
}

const DiscoverCard = ({ title, image, route, className }: props) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";

  return (
    <TouchableOpacity
      // @ts-ignore
      onPress={() => route && router.push(`${route}`)}
      className={`flex flex-col gap-2 rounded-2xl p-3 ${
        currentTheme === "dark"
          ? "border-[.5px] border-light/20"
          : "border-[.5px] border-dark/20"
      } ${className}`}
      style={{ backgroundColor: bg }}
    >
      <ThemedText className="font-cairo text-sm">{title}</ThemedText>
      <Image source={image} resizeMode="contain" className="size-12 ml-auto" />
    </TouchableOpacity>
  );
};

export default DiscoverCard;
