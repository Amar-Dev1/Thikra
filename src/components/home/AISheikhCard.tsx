import { Colors } from "@/src/constants/colors";
import { InfoSvg, RightAngleSvg } from "@/src/constants/icons";
import i18n from "@/src/i18n";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
// @ts-ignore
import shineImg from "@/assets/images/shine.png";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import ThemedText from "../ThemedText";
import { useRouter } from "expo-router";
import { useTheme } from "@/src/context/ThemeContext";

const AISheikhCard = () => {

  // @ts-ignore
  const { currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const router = useRouter();
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginVertical: 12,
        height: 240,
        borderRadius: 30,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      }}
    >
      <Svg height="100%" width="100%" style={{ position: "absolute" }}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#C69C56" stopOpacity="1" />
            <Stop offset="1" stopColor="#EBC67E" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>

      <Image
        source={shineImg}
        style={{
          position: "absolute",
          right: -20,
          top: -20,
          width: 150,
          height: 150,
          opacity: 0.3,
          tintColor: "white",
        }}
        resizeMode="contain"
      />

      <View style={{ padding: 24, flex: 1, justifyContent: "space-between" }}>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <InfoSvg
                width={18}
                height={18}
                stroke={Colors.brandBrown}
                strokeWidth={2}
              />
            </View>
            <ThemedText
              style={{
                fontSize: 20,
                fontFamily: "Cairo-Bold",
                color: Colors.brandBrown,
              }}
            >
              {i18n.t("screens.index.ask_ai_sheikh")}
            </ThemedText>
          </View>

          <ThemedText
            style={{
              fontSize: 14,
              lineHeight: 20,
              color: Colors.brandBrown,
              opacity: 0.8,
              maxWidth: "90%",
            }}
          >
            {i18n.t("screens.index.ai_sheikh_desc")}
          </ThemedText>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: isDark ? "black" : "white",
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 25,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "60%",
            alignSelf: "center",
          }}
          onPress={() => router.push("/(tabs)/AISheikh")}
        >
          <ThemedText
            style={{
              color: isDark ? "white" : "black",
              fontSize: 16,
              marginRight: 8,
            }}
          >
            {i18n.t("screens.index.start_chat")}
          </ThemedText>
          <RightAngleSvg
            width={14}
            height={14}
            stroke={Colors.brandBrown}
            strokeWidth={3}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AISheikhCard;
