import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import React from "react";
import { FlatList, View } from "react-native";

import DuaCategory from "@/components/DuaCategory";
import adhkar from "../../../assets/data/adhkar.json";

import * as g from "@/constants/icons";
import ScreenTitle from "@/components/ScreenTitle";

const iconMap = g as { [key: string]: React.FC<any> };

const index = () => {
  return (
    <BgWrapper className="px-5" hideBackground={true}>
      <View className="flex-1">
        <ScreenTitle title="الدعاء و الذكر"/>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={adhkar}
          renderItem={({ item }) => {
            const iconKey = item.icon;
            const IconComponent = iconMap[iconKey];
            const isLast =
              item.id === adhkar.length || item.id === adhkar.length - 1;
            if (!IconComponent) return null;
            return (
              <DuaCategory
                key={item.id}
                id={item.id}
                title={item.category}
                Icon={IconComponent}
                className={`w-[48%] ${isLast && "mb-24"}`}
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
