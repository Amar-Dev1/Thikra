import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Listen" />
        <Stack.Screen name="Read" />
      </Stack>
  );
};

export default _layout;
