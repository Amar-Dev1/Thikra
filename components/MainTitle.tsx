import React from "react";
import { Text } from "react-native";

interface props {
  title: string;
  className?: string;
}

const MainTitle = ({ title, className }: props) => {
  return (
    <Text
      className={`text-md ${className}`}
      style={{ fontFamily: "Cairo-Bold" }}
    >
      {title}
    </Text>
  );
};

export default MainTitle;
