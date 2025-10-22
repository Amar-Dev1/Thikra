import { images } from "@/constants/images";
import React from "react";
import {  Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
interface Props {
  children: React.ReactNode;
  className?: string;
}

const BgWrapper = ({ children, className }: Props) => {
  return (
    <SafeAreaView className={`flex-1 px-5 py-3 ${className}`} style={{backgroundColor:'transparent'}}>
     <View style={styles.bgWrap} pointerEvents="none">
      <Image
        source={images.clouds}
        resizeMode="repeat"
        className="opacity-10 bg-yellow-300 w-full h-full"
        style={StyleSheet.absoluteFill}
      />
     </View>
      {children}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  bgWrap:{
    ...StyleSheet.absoluteFillObject,
    zIndex:0,
  }
})

export default BgWrapper;
