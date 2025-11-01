import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

import BgWrapper from "@/components/BgWrapper";
import DuaCategoryItem from "@/components/DuaCategoryItem";
import MainTitle from "@/components/MainTitle";
import adhkar from "../../../../assets/data/adhkar.json";

const Index = () => {
  const { Category } = useLocalSearchParams();
  const currentItem = adhkar.find((item) => item.id === Number(Category));

  return (
    <BgWrapper className="px-5" hideBackground={true}>
      <View className="flex-1">
        <View className="relative flex-row items-center justify-center py-4 border-b-[.5px] border-b-dark/20">
          <MainTitle title={currentItem?.category!} />
        </View>

        <FlatList
          data={currentItem?.items}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            const items = currentItem?.items ?? [];
            const isLast = index === items.length - 1;
            return (
              <DuaCategoryItem
                id={item.id.toString()}
                name={item.name}
                categoryId={currentItem?.id!}
                className={`${isLast && "mb-20"}`}
              />
            );
          }}
          contentContainerStyle={{
            justifyContent: "center",
            gap: 7,
          }}
        />
      </View>
    </BgWrapper>
  );
};

export default Index;
