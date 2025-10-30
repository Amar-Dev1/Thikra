import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import React from "react";
import { FlatList, View } from "react-native";

import DuaCategory from "@/components/DuaCategory";
import adhkar from "../../../assets/data/adhkar.json";

import * as g from "@/constants/icons";

const iconMap = g as { [key: string]: React.FC<any> };

const index = () => {
  return (
    <BgWrapper className="px-5" hideBackground={true}>
      <View className="flex-1">
        <View className="relative flex-row items-center justify-center py-4 border-b-[.5px] border-b-dark/20">
          <MainTitle title="الدعاء و الذكر" />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={adhkar}
          renderItem={({ item }) => {
            const iconKey = item.icon;
            const IconComponent = iconMap[iconKey];
            if (!IconComponent) return null;
            return (
              <DuaCategory
                key={item.id}
                id={item.id}
                title={item.category}
                Icon={IconComponent}
                className="w-[48%]"
              />
            );
          }}
          numColumns={2}
          className="py-5"
          columnWrapperStyle={{
            justifyContent: "center",
            gap: 10,
            marginBottom: 10,
          }}
          scrollEnabled={true}
        />
      </View>
    </BgWrapper>
  );
};

export default index;
