import {
  DuaSvg,
  HomeSvg,
  QuranSvg,
  SettingsSvg,
  UnSavedSvg,
} from "@/constants/icons";
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
      width={focused ? 28 : 26}
      height={focused ? 28 : 26}
      fill={iconColor}
      stroke={iconColor}
      className="transition-all"
    />
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarStyle: {
          backgroundColor: "#FFFDF8",
          borderTopWidth: 0.5,
          minHeight: 70,
          position: "absolute",
          overflow: "hidden",
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
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={QuranSvg} name="القرآن" />
          ),
        }}
      />

      <Tabs.Screen
        name="Dua"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} Icon={DuaSvg} name="الدعاء" />
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

export default TabsLayout;
