import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const _layout = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-bgColor px-5"
      style={{ direction: "rtl" }}
    >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Listen" />
        <Stack.Screen name="Read" />
      </Stack>
    </SafeAreaView>
  );
};

export default _layout;
