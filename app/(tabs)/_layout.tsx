import { HomeSvg, QuranSvg, SettingsSvg, UnSavedSvg } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { SvgProps } from "react-native-svg";

interface ITabIcon {
  focused: boolean;
  Icon: React.FC<SvgProps>;
  name?: string;
}

const TabIcon = ({ focused, Icon, name }: ITabIcon) => {
  const iconColor = focused ? "#F5C97B" : "#FFFDF8";
  return (
    <Icon
      width={focused ? 30 : 28}
      height={focused ? 30 : 28}
      fill={iconColor}
      stroke={iconColor}
      className="transition-all"
    />
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarStyle: {
          backgroundColor: "#faf7ef",
          borderTopWidth: 1,
          minHeight: 70,
          position: "absolute",
          overflow: "hidden",
          direction: "rtl",
        },
      }}
    >
      <Tabs.Screen
        name="index"
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
          tabBarStyle:{display:"none"},
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
