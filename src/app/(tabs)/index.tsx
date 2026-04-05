import AyatData from "@/assets/data/Ayat.json";
import BgWrapper from "@/src/components/BgWrapper";
import AISheikhCard from "@/src/components/home/AISheikhCard";
import DhikrCounter from "@/src/components/home/DhikrCounter";
import VerseOfTheDay from "@/src/components/home/VerseOfTheDay";
import ThemedText from "@/src/components/ThemedText";
import { Colors } from "@/src/constants/colors";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const Index = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const [randomAyah, setRandomAyah] = useState<{
    ayah: string;
    translation?: string;
  } | null>(null);

  // prepare data
  useEffect(() => {
    async function prepareData() {
      try {
        // set daily ayah from the new structured AyatData
        // Filter out surahs that might not have verses for some reason (safeguard)
        const validSurahs = AyatData.filter(
          (s) => s.verses && s.verses.length > 0
        );
        const randomSurah =
          validSurahs[Math.floor(Math.random() * validSurahs.length)];
        const randomVerse =
          randomSurah.verses[
            Math.floor(Math.random() * randomSurah.verses.length)
          ];

        setRandomAyah({
          ayah: randomVerse.text,
          translation:
            randomVerse.translation ||
            i18n.t("screens.index.placeholder_ayah_translation"),
        });
      } catch (e) {
        console.error("Failed to prepare data", e);
      }
    }
    prepareData();
  }, []);

  const mainTextColor = isDark ? Colors.darkText : Colors.brandBrown;
  const mutedTextColor = isDark ? "rgba(255,255,255,0.4)" : Colors.textMuted;

  return (
    <BgWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Branding */}
        <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
          <ThemedText
            style={{
              fontSize: 22,
              color: mainTextColor,
            }}
          >
            Thikra - ذِكرى
          </ThemedText>
        </View>

        {/* Greeting Section */}
        <View
          style={{ paddingHorizontal: 20, marginTop: 40, marginBottom: 20 }}
        >
          <ThemedText
            style={{
              fontSize: 13,
              fontWeight: "bold",
              color: mutedTextColor,
              letterSpacing: 1.1,
              textTransform: "uppercase",
            }}
          >
            ASSALAMU ALAIKUM
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 36,
              color: mainTextColor,
              marginTop: 4,
            }}
          >
            {i18n.t("screens.index.greeting_main")}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 15,
              color: mutedTextColor,
              marginTop: 6,
              lineHeight: 22,
              maxWidth: "80%",
            }}
          >
            {i18n.t("screens.index.greeting_sub")}
          </ThemedText>
        </View>

        {/* Dhikr Counter */}
        <DhikrCounter />

        {/* AI Sheikh Card */}
        <AISheikhCard />

        {/* Verse of the Day */}
        {randomAyah && (
          <VerseOfTheDay
            ayah={randomAyah.ayah}
            translation={randomAyah.translation}
          />
        )}
      </ScrollView>
    </BgWrapper>
  );
};

export default Index;
