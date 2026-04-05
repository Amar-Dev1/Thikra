import ThemedText from "@/src/components/ThemedText";
import { Colors } from "@/src/constants/colors";
import { HomeSvg, SettingsSvg, SheikhSvg } from "@/src/constants/icons";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

interface ITabIcon {
  focused: boolean;
  Icon: React.FC<SvgProps>;
  name: string;
}

const TabsLayout = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const TabIcon = ({ focused, Icon, name }: ITabIcon) => {
    const iconColor = focused
      ? isDark
        ? Colors.accent
        : Colors.brandBrown
      : isDark
      ? "rgba(255,255,255,0.4)"
      : Colors.textMuted;

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon width={28} height={28} stroke={iconColor} strokeWidth={1.5} />
        <ThemedText
          numberOfLines={1}
          style={{
            fontSize: 11, // Slightly smaller to ensure it fits
            marginTop: 4,
            color: iconColor,
            textTransform: "uppercase",
            minWidth: 100, // Increased from 70
            textAlign: "center",
          }}
        >
          {name}
        </ThemedText>
      </View>
    );
  };

  const AISheikhIcon = ({ focused }: { focused: boolean }) => {
    const scale = useSharedValue(1);

    useEffect(() => {
      scale.value = withSpring(focused ? 1.15 : 1);
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    return (
      <Animated.View
        style={[
          {
            width: 68,
            height: 68,
            borderRadius: 34,
            backgroundColor: Colors.accent,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 30,
            borderWidth: 4,
            borderColor: isDark ? "#1A1A1A" : Colors.background,
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          },
          animatedStyle,
        ]}
      >
        <SheikhSvg width={44} height={44} fill={Colors.brandBrown} />
      </Animated.View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1A1A1A" : Colors.background,
          borderTopWidth: 0,
          height: 105, // Increased from 90
          paddingBottom: Platform.OS === "ios" ? 35 : 15,
          elevation: 0,
          shadowOpacity: 0,
          position: "absolute",
          borderTopLeftRadius: 35,
          borderTopRightRadius: 35,
        },
        tabBarItemStyle: {
          paddingTop: 15,
        },
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
        name="AISheikh"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <AISheikhIcon focused={focused} />,
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
