import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import React from "react";
import { View } from "react-native";

const AISheikh = () => {
  return (
    <BgWrapper>
      <View className="flex-1 items-center justify-center">
        <ThemedText className="text-xl font-bold">AI Sheikh Bot</ThemedText>
        <ThemedText className="text-muted mt-2">Coming Soon...</ThemedText>
      </View>
    </BgWrapper>
  );
};

export default AISheikh;
