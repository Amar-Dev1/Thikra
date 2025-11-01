import BgWrapper from "@/components/BgWrapper";
import GreatName from "@/components/GreatName";
import MainTitle from "@/components/MainTitle";
import { RightAngleSvg } from "@/constants/icons";
import { IGreatName } from "@/interfaces";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Namesdata from "../assets/data/Names_Of_Allah.json";

const GreatNames = () => {
  const { height, width } = Dimensions.get("window");

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
      <View className="relative flex-row items-center justify-center py-4 border-b-[.5px] border-b-dark/20">
        <TouchableOpacity
          className="absolute left-0 w-12 h-12 flex justify-center items-center bg-light border border-gray-300 rounded-full"
          onPress={router.back}
        >
          <RightAngleSvg width={26} />
        </TouchableOpacity>
        <MainTitle title="أسماء الله الحسنى" className="text-center" />
      </View>

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
        <View className="relative items-center justify-center gap-4 p-8 rounded-2xl bg-primary">
          <Text className="font-cairo-bold text-xl text-center">
            {selectedName?.name}
          </Text>
          <View className="bg-light rounded-xl p-3 border border-gray-200">
            <Text className="font-cairo text-center">{selectedName?.text}</Text>
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
