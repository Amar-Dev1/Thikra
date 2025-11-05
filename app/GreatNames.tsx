import BgWrapper from "@/components/BgWrapper";
import GreatName from "@/components/GreatName";
import ScreenTitle from "@/components/ScreenTitle";
import ThemedText from "@/components/ThemedText";
import { RightAngleSvg } from "@/constants/icons";
import { useTheme } from "@/context/ThemeContext";
import { IGreatName } from "@/interfaces";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Namesdata from "../assets/data/Names_Of_Allah.json";

const GreatNames = () => {
  const { height, width } = Dimensions.get("window");

  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";

  const [selectedName, setSelectedName] = useState<IGreatName | null>(null);
  const [visible, setVisible] = useState(false);

  const handleSelect = (item: IGreatName) => {
    setSelectedName(item);
    setVisible(true);
  };

  const handleExit = () => {
    setSelectedName(null);
    setVisible(false);
  };

  const Overlay = () => {
    return (
      <View
        className="absolute bg-black/50 backdrop-blur-2xl z-40"
        style={{ width: width, height: height + 15 }}
      ></View>
    );
  };

  return (
    <BgWrapper className="px-5" hideBackground={true}>
      <ScreenTitle
        title="أسماء الله الحسنى"
        className="flex-row items-center py-4"
      >
        <TouchableOpacity
          className="absolute left-0 w-10 h-10 flex justify-center items-center bg-light border border-gray-300 rounded-full"
          onPress={router.back}
        >
          <RightAngleSvg width={24} height={24} />
        </TouchableOpacity>
      </ScreenTitle>

      <ScrollView showsVerticalScrollIndicator={false} className="py-5">
        <FlatList
          data={Namesdata}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <GreatName
              {...item}
              className="w-[32%] min-h-[80px]"
              // @ts-ignore
              onPress={() => handleSelect(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          columnWrapperStyle={{
            justifyContent: "flex-start",
            gap: 5,
            marginBottom: 5,
          }}
          className="pb-5"
        />
      </ScrollView>

      <Modal
        isVisible={visible}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        coverScreen={false}
        customBackdrop={<Overlay />}
      >
        <View
          className="relative items-center justify-center gap-4 p-8 rounded-2xl"
          style={{ backgroundColor: bg }}
        >
          <ThemedText className="font-cairo-bold text-xl text-center">
            {selectedName?.name}
          </ThemedText>
          <View
            className={`rounded-xl p-3 border-[.5px] ${
              currentTheme === "dark"
                ? "bg-[#333333] border-light/10"
                : "bg-light border-dark/20"
            }`}
          >
            <ThemedText className="font-cairo text-center">
              {selectedName?.text}
            </ThemedText>
          </View>
          <TouchableOpacity
            className="absolute top-2 left-2 bg-light w-10 h-10 justify-center items-center rounded-full"
            onPress={handleExit}
          >
            <RightAngleSvg width={24} height={24} />
          </TouchableOpacity>
        </View>
      </Modal>
    </BgWrapper>
  );
};

export default GreatNames;
