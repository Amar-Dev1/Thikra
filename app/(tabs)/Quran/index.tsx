import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import { InfoSvg, QuranSvg } from "@/constants/icons";
import { getBooleanFromStorage } from "@/utils/getBooleanFromStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

const Index = () => {
  const [loading, setLoading] = useState<boolean | null>(false);
  const [selectedChoise, setSelectedChoise] = useState<number | null>(null);
  const [quranFound, setQuranFound] = useState<boolean | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  
  useEffect(() => {
    async function checkQuran() {
      try {
        const found = await getBooleanFromStorage("quranFound");
        if (found === null) {
          await AsyncStorage.setItem("quranFound", "false");
          setQuranFound(found);
        } else if (found === true) {
          router.push("/Quran/Read");
        }
      } catch (e) {
        console.error(e);
      }
    }
    checkQuran();
  }, []);

  return (
    <BgWrapper>
      <View className="flex-1">
        <View className="w-full flex-row justify-center py-3 border-b-[.5px] border-gray-400">
          <MainTitle title="القرآن" />
        </View>
        {!quranFound ? (
          <View className="flex-1 pt-8 gap-5">
            <TouchableOpacity
              className="bg-primary py-5 px-3 rounded-2xl shadow-md flex flex-row items-start gap-3"
              onPress={() => {
                setSelectedChoise(1);
                setVisible(!visible);
              }}
            >
              <View className="bg-bgColor p-3 rounded-full">
                <QuranSvg width={30} height={30} fill={"#F5C97B"} />
              </View>
              <View className="flex-1 flex-col">
                <Text className="font-cairo-bold">تحميل القرآن كاملاً</Text>
                <Text className="font-cairo text-sm opacity-65">
                  قم بالتحميل مرة واحدة فقط ، و من ثمّ يمكنك الوصول الى جميع
                  الصفحات دون اتصال انترنت
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary py-5 px-3 rounded-2xl shadow-md flex flex-row items-start gap-3"
              onPress={() => {
                setSelectedChoise(2);
                setVisible(!visible);
              }}
            >
              <View className="bg-bgColor p-3 rounded-full">
                <QuranSvg width={30} height={30} fill={"#F5C97B"} />
              </View>
              <View className="flex-1 flex-col">
                <Text className="font-cairo-bold">تحميل صفحات محدودة </Text>
                <Text className="font-cairo text-sm opacity-65">
                  يمكنك تحميل عدد محدود من الصفحات ، و من ثمّ يمكنك الوصول إليها
                  دون الحاجه إالى انترنت
                </Text>
              </View>
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <InfoSvg width={22} height={22} />
              <Text className="font-cairo opacity-65">
                حجم المصحف كاملاً :
                <Text className="font-cairo-bold opacity-100"> 50 MB </Text>
              </Text>
            </View>

            <Modal
              isVisible={visible}
              coverScreen={true}
              className="bg-bgColor rounded-2xl"
              animationIn="slideInUp"
              animationOut={"slideOutDown"}
              animationInTiming={500}
              animationOutTiming={500}
            >
              <View className="flex-1 justify-center items-center gap-4">
                {selectedChoise === 1 ? (
                  <View className="gap-3 items-center">
                    <Text className="font-cairo-bold">جار التحميل...</Text>
                    <View className="relative w-[60%] h-4 bg-primary rounded-full">
                      <View
                        className="absolute h-full bg-dark rounded-full"
                        style={{ width: `50%` }}
                      ></View>
                    </View>
                  </View>
                ) : (
                  <Text>Specific pages</Text>
                )}
                <TouchableOpacity
                  className="bg-primary py-3 px-8 mx-auto rounded-2xl shadow-md"
                  onPress={() => setVisible(!visible)}
                >
                  <Text className="font-cairo-bold text-xl">إالغاء</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        ) : (
          <Text>found</Text>
        )}
      </View>
    </BgWrapper>
  );
};

export default Index;
