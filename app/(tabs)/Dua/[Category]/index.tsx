import { useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";

import BgWrapper from "@/components/BgWrapper";
import DuaCategoryItem from "@/components/DuaCategoryItem";
import adhkar from "../../../../assets/data/adhkar.json";
import ScreenTitle from "@/components/ScreenTitle";

const Index = () => {
  const { Category } = useLocalSearchParams();
  const currentItem = adhkar.find((item) => item.id === Number(Category));

  return (
    <BgWrapper className="px-5" hideBackground={true}>
      <View className="flex-1">
        <ScreenTitle title={currentItem?.category!}/>
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
                index={index + 1}
                name={item.name}
                categoryId={currentItem?.id!}
                className={`${isLast && "mb-20"}`}
              />
            );
          }}
          contentContainerStyle={{
            justifyContent: "center",
            gap: 10,
            paddingTop:10
          }}
        />
      </View>
    </BgWrapper>
  );
};

export default Index;
