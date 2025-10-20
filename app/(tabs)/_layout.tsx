import { HomeSvg, QuranSvg, SettingsSvg, UnSavedSvg } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { SvgProps } from "react-native-svg";

interface ITabIcon {
  focused: boolean;
  Icon: React.FC<SvgProps>;
  name: string;
}

const TabIcon = ({ focused, Icon, name }: ITabIcon) => {
  const iconColor = focused ? "#F5C97B" : "#FFFDF8";
  return <Icon width={30} height={30} fill={iconColor} stroke={iconColor} />;
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          marginTop: 8,
        },
        tabBarStyle: {
          backgroundColor: "#FFFDF8",
          borderTopWidth: 0.5,
          height: 80,
          position: "absolute",
          overflow: "hidden",
          direction: "rtl",
        },
      }}
    >
      <Tabs.Screen
        name="Index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={HomeSvg} name="الصفحة الرئيسية" />
          ),
        }}
      />

      <Tabs.Screen
        name="Quran"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={QuranSvg} name="القرآن" />
          ),
        }}
      />
      <Tabs.Screen
        name="Saved"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={UnSavedSvg} name="المحفوظات" />
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={SettingsSvg} name="الإعدادات" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
