import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, View } from "react-native";

interface props {
  title: string;
  className?: string;
  children?:React.ReactNode
}

const ScreenTitle = ({ title, className ,children}: props) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  return (
    <View
      className={`relative flex-row items-center justify-center py-3  ${
        currentTheme === "dark"
          ? "border-b-[.5px] border-b-light/20"
          : "border-b-[.5px] border-b-dark/20"
      } ${className} `}
    >
      <Text className={`text-md font-cairo-bold`} style={{ color: textColor }}>
        {title}
      </Text>
      {children}
    </View>
  );
};

export default ScreenTitle;