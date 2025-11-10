import React, { useEffect, useState } from "react";
import BgWrapper from "@/components/BgWrapper";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import ScreenTitle from "@/components/ScreenTitle";
import { RightAngleSvg } from "@/constants/icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IPrayerDetails } from "@/interfaces";
import SalahItem from "@/components/SalahItem";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";

const SalahTimes = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#111111" : "#ffffff";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const [timings, setTimings] = useState<IPrayerDetails[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getTimings = async () => {
      try {
        setLoading(true);
        const storedTimings = await AsyncStorage.getItem("timings");
        const timings: IPrayerDetails[] = storedTimings
          ? JSON.parse(storedTimings)
          : [];
        if (timings.length > 0) {
          setTimings(timings);
        }
      } catch (e) {
        console.error(e);
        Alert.alert("خطأ", "خطأ في أوقات الصلاة", [
          { text: "الصفحة الرئيسية", onPress: () => router.push("/") },
        ]);
      } finally {
        setLoading(false);
      }
    };
    getTimings();
  }, []);

  return (
    <BgWrapper className="px-5">
      <ScreenTitle title="المزيد" className="flex-row items-center py-4">
        <TouchableOpacity
          className="absolute left-0 w-10 h-10 flex justify-center items-center bg-light border border-gray-300 rounded-full"
          onPress={router.back}
        >
          <RightAngleSvg width={24} height={24} />
        </TouchableOpacity>
      </ScreenTitle>
      {loading ? (
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: bg }}
        >
          <ActivityIndicator size={"large"} color={textColor} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="mt-5"
          contentContainerStyle={{
            display: "flex",
            gap: 8,
          }}
        >
          {timings.map((salah, index) => (
            <Animated.View
              entering={FadeInRight.springify().delay(index * 200)}
              key={index}
            >
              <SalahItem
                name={salah.name}
                time={salah.time}
                to={salah.to}
                enName={salah.enName}
              />
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </BgWrapper>
  );
};

export default SalahTimes;
