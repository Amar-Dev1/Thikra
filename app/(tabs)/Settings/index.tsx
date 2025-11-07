import BgWrapper from "@/components/BgWrapper";
import ScreenTitle from "@/components/ScreenTitle";
import SettingsItem from "@/components/SettingsItem";
import ThemedText from "@/components/ThemedText";
import { RightAngleSvg } from "@/constants/icons";
import { images } from "@/constants/images";
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeInDown } from "react-native-reanimated";
import { settingsElements } from "./elements";

const { width, height } = Dimensions.get("window");

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
    <BgWrapper className="px-5 gap-3 bg-bgColor">
      <ScreenTitle title="الإعدادات" />
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {settingsElements.map((item, index) => {
          const onPress =
            item.title === "السمات"
              ? () => setThemeModalVisible(true)
              : item.onPress;
          return (
            <Animated.View
              key={index}
              entering={FadeInDown.springify().delay(index * 200)}
            >
              <SettingsItem {...item} onPress={onPress} className="flex-1" />
            </Animated.View>
          );
        })}
      </ScrollView>
      <Animated.View
        className={`min-h-[25%] mb-safe-or-16`}
        entering={FadeInDown.springify().delay(400)}
      >
        <ImageBackground
          source={images.settingsImg}
          resizeMode="cover"
          className="flex-1 relative  rounded-2xl overflow-hidden flex-col justify-center px-5"
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
      </Animated.View>

      <Modal
        isVisible={themeModalVisible}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        animationInTiming={400}
        animationOutTiming={400}
        customBackdrop={
          <TouchableOpacity
            onPress={(prev) => setThemeModalVisible(!prev)}
            className={`absolute inset-0 bg-dark/90 border`}
            style={{ width, height: height + 40 }}
          ></TouchableOpacity>
        }
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
