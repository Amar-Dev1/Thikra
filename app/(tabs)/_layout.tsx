import {
  DuaSvg,
  HomeSvg,
  QuranSvg,
  SettingsSvg,
  UnSavedSvg,
} from "@/constants/icons";
import { useTheme } from "@/context/ThemeContext";
import { Tabs } from "expo-router";
import React from "react";
import { SvgProps } from "react-native-svg";

interface ITabIcon {
  focused: boolean;
  Icon: React.FC<SvgProps>;
  name?: string;
}

const TabsLayout = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#111111" : "#ffffff";

  const TabIcon = ({ focused, Icon, name }: ITabIcon) => {
    const themeColor = currentTheme === "dark" ? "#ffffff" : "#111111";
    const iconColor = focused ? "#F5C97B" : "#FFFDF8";

    return (
      <Icon
        width={focused ? 24 : 22}
        height={focused ? 24 : 22}
        stroke={focused ? iconColor : themeColor}
        strokeWidth={1}
        className="transition-all"
      />
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          paddingTop: 5,
        },
        tabBarStyle: {
          backgroundColor: bg,
          borderTopWidth: 0.5,
          borderTopColor: currentTheme === "dark" ? "#333333" : "#888888",
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
