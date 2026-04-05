import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import { RightAngleSvg } from "@/src/constants/icons";
import { useTheme } from "@/src/context/ThemeContext";
import React, { useState } from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Modal from "react-native-modal";

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

{/* new code here */}

<View>
  <Text>Settings</Text>
</View>

{/* new code here */}


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
