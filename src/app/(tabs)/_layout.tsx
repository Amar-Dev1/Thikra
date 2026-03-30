import {
  DuaSvg,
  HomeSvg,
  SettingsSvg,
  UnSavedSvg,
} from "@/src/constants/icons";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { Tabs } from "expo-router";
import React from "react";
import { ViewStyle } from "react-native";
import { SvgProps } from "react-native-svg";

interface ITabIcon {
  focused: boolean;
  Icon: React.FC<SvgProps>;
  name?: string;
}

const TabsLayout = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();

  const TabIcon = ({ focused, Icon, name }: ITabIcon) => {
    const themeColor = currentTheme === "dark" ? "#ffffff" : "#111111";
    const iconColor = focused ? "#F5C97B" : "#FFFDF8";

    return (
      <Icon
        width={focused ? 24 : 22}
        height={focused ? 24 : 22}
        stroke={focused ? iconColor : themeColor}
        strokeWidth={1}
      />
    );
  };

  return (
    <Tabs
      screenOptions={() => {
        const bg = currentTheme === "dark" ? "#222222" : "#ffffff";
        const tabBarStyle: ViewStyle = {
          backgroundColor: bg,
          borderTopWidth: 0.05,
          borderTopColor: currentTheme === "dark" ? "#333333" : "#FFFDF8",
          minHeight: 60,
          position: "absolute",
          overflow: "hidden",
        };

        return {
          tabBarShowLabel: false,
          tabBarStyle: tabBarStyle,
          tabBarItemStyle: {
            paddingTop: 5,
          },
        };
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              Icon={HomeSvg}
              name={i18n.t("screens.index.title")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Dua"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              Icon={DuaSvg}
              name={i18n.t("screens.dua.title")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Saved"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              Icon={UnSavedSvg}
              name={i18n.t("screens.saved.title")}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              Icon={SettingsSvg}
              name={i18n.t("screens.settings.title")}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
