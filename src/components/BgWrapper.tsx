import { Colors } from "@/src/constants/colors";
import { useTheme } from "@/src/context/ThemeContext";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface Props {
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const BgWrapper = ({ children, className, style }: Props) => {
  // @ts-ignore
  const { currentTheme } = useTheme();

  const bg = currentTheme === "dark" ? "#111111" : Colors.background;

  return (
    <SafeAreaView
      className={`flex-1 ${className}`}
      style={[{ backgroundColor: bg }, style]}
    >
      {children}
    </SafeAreaView>
  );
};

export default BgWrapper;
