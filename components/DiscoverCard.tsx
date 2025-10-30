import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

interface props {
  id?: any;
  title: string;
  image: any;
  route: any;
  className?: string;
}

const DiscoverCard = ({ title, image, route, className }: props) => {
  return (
    <TouchableOpacity
      // @ts-ignore
      onPress={() => router.push(`${route}`)}
      className={`flex flex-col gap-2 bg-primary rounded-2xl p-3 border-[.5px] border-dark/40 ${className}`}
    >
      <Text style={{ fontFamily: "Cairo-Regular" }}>{title}</Text>
      <Image
        source={image}
        resizeMode="contain"
        className="size-14 ml-auto"
      />
    </TouchableOpacity>
  );
};

export default DiscoverCard;
