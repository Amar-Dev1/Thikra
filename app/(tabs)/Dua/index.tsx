import BgWrapper from "@/components/BgWrapper";
import React from "react";
import { FlatList, View } from "react-native";

import DuaCategory from "@/components/DuaCategory";
import adhkar from "../../../assets/data/adhkar.json";

import ScreenTitle from "@/components/ScreenTitle";
import * as g from "@/constants/icons";
import Animated, { FadeInDown } from "react-native-reanimated";

const iconMap = g as { [key: string]: React.FC<any> };

const AnimatedDuaCategory = Animated.createAnimatedComponent(DuaCategory);

const index = () => {
  return (
    <BgWrapper className="px-5">
      <View className="flex-1">
        <ScreenTitle title="الدعاء و الذكر" />
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => String(item.id)}
          data={adhkar}
          renderItem={({ item, index: itemIndex }) => {
            const iconKey = item.icon;
            const IconComponent = iconMap[iconKey];
            const isLast =
              item.id === adhkar.length || item.id === adhkar.length - 1;
            if (!IconComponent) return null;
            return (
              <Animated.View
                entering={FadeInDown.springify().delay(itemIndex * 100)}
                style={{ width: "48%", marginBottom: isLast ? 24 : 0 }}
              >
                <DuaCategory
                  key={item.id}
                  id={item.id}
                  title={item.category}
                  Icon={IconComponent}
                  className={`${isLast ? "mb-16" : ""}`}
                />
              </Animated.View>
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
