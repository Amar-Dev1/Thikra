import BgWrapper from "@/components/BgWrapper";
import ScreenTitle from "@/components/ScreenTitle";
import SettingsItem from "@/components/SettingsItem";
import ThemedText from "@/components/ThemedText";
import { RightAngleSvg } from "@/constants/icons";
import { images } from "@/constants/images";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { settingsElements } from "./elements";

const Index = () => {
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  // @ts-ignore
  const { currentTheme, changeTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ccc" : "#222222";

  const handleChange = async (theme: string) => {
    setThemeModalVisible(!themeModalVisible);
    await changeTheme(theme);
  };

  return (
    <BgWrapper className="px-5 gap-3 bg-bgColor" hideBackground={true}>
      <ScreenTitle title="الإعدادات" />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {settingsElements.map((item, Index) => {
          const onPress =
            item.title === "السمات"
              ? () => setThemeModalVisible(true)
              : item.onPress;
          return <SettingsItem key={Index} {...item} onPress={onPress} />;
        })}
      </ScrollView>
      <ImageBackground
        source={images.settingsImg}
        resizeMode="cover"
        className="relative min-h-[25%] mb-16 rounded-2xl overflow-hidden flex-col justify-center px-5"
      >
        <View
          className={`absolute inset-0 ${
            currentTheme === "dark" ? "bg-black/50" : "bg-black/70"
          } `}
        />
        <Text className="text-light font-cairo-bold text-xl text-center">
          وَذَكِّرْ فَإِنَّ الذِّكْرَى تَنْفَعُ الْمُؤْمِنِينَ
        </Text>
        <Text className="text-light font-cairo text-xs text-center mt-5">
          [ الذاريات: 55]
        </Text>
      </ImageBackground>

      <Modal
        isVisible={themeModalVisible}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        animationInTiming={500}
        animationOutTiming={500}
      >
        <View
          className={`gap-4 py-5 px-3 rounded-2xl ${
            currentTheme === "dark" ? "bg-[#111111]" : "bg-light"
          }`}
        >
          <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
            <RightAngleSvg width={18} height={18} stroke={textColor} />
          </TouchableOpacity>

          <TouchableOpacity
            className="py-3 px-5 rounded-2xl"
            style={{ backgroundColor: bg }}
            onPress={() => handleChange("light")}
          >
            <ThemedText>Light</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-5 rounded-2xl"
            style={{ backgroundColor: bg }}
            onPress={() => handleChange("dark")}
          >
            <ThemedText>Dark</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-3 px-5 rounded-2xl"
            style={{ backgroundColor: bg }}
            onPress={() => handleChange("system")}
          >
            <ThemedText>System (default)</ThemedText>
          </TouchableOpacity>
        </View>
      </Modal>
    </BgWrapper>
  );
};

export default Index;
