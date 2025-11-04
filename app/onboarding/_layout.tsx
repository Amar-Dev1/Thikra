import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, statusBarHidden: true }}>
      <Stack.Screen name="AllowNotification" options={{headerShown:false}}/>
      <Stack.Screen name="AccessLocation" options={{headerShown:false}}/>
      <Stack.Screen name="SetupAll" options={{headerShown:false}}/>
    </Stack>
  );
};

export default _layout;