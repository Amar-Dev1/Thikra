import { Colors } from "@/src/constants/colors";
import { ShareSvg } from "@/src/constants/icons";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import React from "react";
import { Platform, Share, TouchableOpacity, View } from "react-native";
import ThemedText from "../ThemedText";

interface Props {
  ayah: string;
  translation?: string;
}

const VerseOfTheDay = ({ ayah, translation }: Props) => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const onShare = async () => {
    try {
      await Share.share({
        message: `${ayah}\n\n${translation}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const bgColor = isDark ? Colors.darkCard : "white";
  const mainTextColor = isDark ? Colors.darkText : Colors.brandBrown;
  const mutedTextColor = isDark ? "rgba(255,255,255,0.5)" : Colors.textMuted;

  return (
    <View
      style={{
        backgroundColor: bgColor,
        borderRadius: 30,
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 24,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDark ? 0.3 : 0.05,
        shadowRadius: 10,
      }}
    >
      <ThemedText
        style={{
          fontSize: 12,
          color: mutedTextColor,
          letterSpacing: 1.2,
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        {i18n.t("screens.index.verse_of_the_day")}
      </ThemedText>

      <ThemedText
        style={{
          fontSize: 22,
          fontFamily:'Amiri-Bold',
          color: mainTextColor,
          textAlign: "center",
          lineHeight: 38,
          marginBottom: 16,
        }}
      >
        {ayah}
      </ThemedText>

      <ThemedText
        style={{
          fontSize: 14,
          fontFamily:'Amiri-Regular',
          color: mutedTextColor,
          textAlign: "center",
          lineHeight: 22,
          marginBottom: 20,
        }}
      >
        "
        {translation ||
          "So remember Me; I will remember you. And be grateful to Me and do not deny Me."}
        "
      </ThemedText>

      <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
        <TouchableOpacity onPress={onShare} activeOpacity={0.7}>
          <ShareSvg
            width={20}
            height={20}
            stroke={mutedTextColor}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerseOfTheDay;
