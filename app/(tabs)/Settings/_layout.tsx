import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="EditLocation" />
      <Stack.Screen name="About" />
    </Stack>
  );
};

export default _layout;
