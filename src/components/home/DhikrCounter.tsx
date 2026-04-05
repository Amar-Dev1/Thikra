import { Colors } from "@/src/constants/colors";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
// @ts-ignore
import mosqueImg from "@/assets/images/mosque.png";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path } from "react-native-svg";
import ThemedText from "../ThemedText";

const AnimatedView = Animated.createAnimatedComponent(View);

const DhikrCounter = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const [count, setCount] = useState(0);
  const [dhikrName, setDhikrName] = useState(
    i18n.t("screens.index.subhanallah")
  );
  const maxCount = 33;
  const radius = 80;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;

  const scale = useSharedValue(1);
  const progressScale = useSharedValue(1);

  const strokeDashoffset = circumference - (count / maxCount) * circumference;

  const handleIncrement = () => {
    const nextCount = count + 1;

    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Animation
    scale.value = withSequence(withSpring(1.2), withSpring(1));

    if (nextCount > maxCount) {
      setCount(1);
      progressScale.value = withTiming(1);
    } else {
      setCount(nextCount);
      if (nextCount === maxCount) {
        // Completion effects
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        progressScale.value = withSequence(withSpring(1.1), withSpring(1));
      }
    }
  };

  const handleReset = () => {
    setCount(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progressScale.value }],
  }));

  const bgColor = isDark ? Colors.darkCard : "#F1EDE4";
  const mainTextColor = isDark ? Colors.darkText : Colors.brandBrown;
  const mutedTextColor = isDark ? "rgba(255,255,255,0.5)" : Colors.brandBrown;
  const circleBg = isDark ? "#333333" : "#E8E2D5";
  const buttonResetBg = isDark ? "#333333" : "#E0DBD0";

  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderRadius: 40,
        marginHorizontal: 16,
        marginVertical: 16,
        paddingVertical: 32,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 10,
        elevation: 5,
      }}
    >
      <View
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatedView style={animatedCircleStyle}>
          <Svg width={200} height={200} viewBox="0 0 200 200">
            <Circle
              cx="100"
              cy="100"
              r={radius}
              stroke={circleBg}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="100"
              cy="100"
              r={radius}
              stroke={isDark ? Colors.accent : Colors.brandBrown}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform="rotate(-90 100 100)"
            />
            <Circle
              cx="100"
              cy="100"
              r={radius - 4}
              stroke={Colors.accent}
              strokeWidth={1}
              fill="none"
              opacity={isDark ? 0.2 : 0.3}
            />
          </Svg>
        </AnimatedView>

        <Image
          source={mosqueImg}
          style={{
            position: "absolute",
            width: 140,
            height: 140,
            opacity: isDark ? 0.05 : 0.08,
            tintColor: mainTextColor,
            zIndex: -1,
          }}
          resizeMode="contain"
        />

        <View style={{ position: "absolute", alignItems: "center" }}>
          <Animated.Text
            style={[
              {
                fontSize: 64,
                fontWeight: "bold",
                color: mainTextColor,
              },
              animatedTextStyle,
            ]}
          >
            {count}
          </Animated.Text>

          <TextInput
            value={dhikrName}
            onChangeText={setDhikrName}
            placeholder={i18n.t("screens.index.subhanallah")}
            placeholderTextColor={
              isDark ? "rgba(255,255,255,0.3)" : "rgba(122, 91, 53, 0.4)"
            }
            style={{
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              color: mutedTextColor,
              marginTop: -4,
              textAlign: "center",
              width: 150,
              fontFamily:'Cairo-Regular'
            }}
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleIncrement}
        activeOpacity={0.8}
        style={{
          backgroundColor: isDark ? Colors.accent : Colors.brandBrown,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 24,
          paddingVertical: 14,
          borderRadius: 25,
          marginTop: 20,
          zIndex: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        }}
      >
        <Svg
          width={18}
          height={18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isDark ? Colors.dark : "white"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <Path d="M15 18l-2 2-2-2" />
          <Path d="M7 10h14" />
          <Path d="M7 6h14" />
          <Path d="M7 14h14" />
          <Path d="M7 18h14" />
        </Svg>
        <ThemedText
          style={{
            color: isDark ? Colors.dark : "white",
            marginLeft: 10,
            fontSize: 14,
            letterSpacing: 0.5,
          }}
        >
          {i18n.t("screens.index.tap_to_count")}
        </ThemedText>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", marginTop: 32, gap: 12 }}>
        <TouchableOpacity
          onPress={handleReset}
          style={{
            backgroundColor: buttonResetBg,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 18,
          }}
        >
          <ThemedText
            style={{
              color: mainTextColor,
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            {i18n.t("screens.index.reset")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DhikrCounter;
