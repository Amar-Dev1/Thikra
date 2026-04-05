import { Colors } from "@/src/constants/colors";
import { useTheme } from "@/src/context/ThemeContext";
import React from "react";
import { Text, TextProps } from "react-native";

const ThemedText = ({ children, style, ...props }: TextProps) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "dark" ? "#ccc" : Colors.textMain;

  return (
    <Text
      {...props}
      style={[{ color: textColor, fontFamily: "Cairo-Regular" }, style]}
    >
      {children}
    </Text>
  );
};

export default ThemedText;
