import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { Text, TextProps } from "react-native";

const ThemedText = ({ children, style, ...props }: TextProps) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "dark" ? "#ccc" : "#222222";

  return (
    <Text {...props} style={[{ color: textColor }, style]}>
      {children}
    </Text>
  );
};

export default ThemedText;
