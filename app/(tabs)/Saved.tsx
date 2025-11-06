import BgWrapper from "@/components/BgWrapper";
import ScreenTitle from "@/components/ScreenTitle";
import ThemedText from "@/components/ThemedText";
import { QuranSvg, TrashSvg, UnSavedSvg } from "@/constants/icons";
import { useTheme } from "@/context/ThemeContext";
import { ISavedCategory, ISavedCategoryItem } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

const Saved = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<ISavedCategory[]>([]);
  const [selectedCat, setSelectedCat] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ISavedCategoryItem | null>(
    null
  );
  const [visible, setVisible] = useState(false);

  const SavedItems = saved.find((cat) => cat.id === selectedCat)?.items;

  const handleRemove = async () => {
    if (!selectedItem) return;
    try {
      setLoading(true);

      const data = await AsyncStorage.getItem("Saved");
      const saved: ISavedCategory[] = data ? JSON.parse(data) : [];

      const updated = saved.map((cat) =>
        cat.id === selectedCat
          ? {
              ...cat,
              items: cat.items.filter((item) => item.id !== selectedItem?.id),
            }
          : cat
      );
      await AsyncStorage.setItem("Saved", JSON.stringify(updated));
      setSaved(updated);
      setVisible(false);
      setSelectedItem(null);
    } catch (e) {
      console.log(e);
      Alert.alert(" خطأ !", "حدث خطأ، يرجى إعادة التحميل ", [
        { text: "موافق", style: "default" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const prepareData = async () => {
        try {
          setLoading(true);
          const data = await AsyncStorage.getItem("Saved");
          const saved: ISavedCategory[] = data ? JSON.parse(data) : [];
          if (Array.isArray(saved)) setSaved(saved);
        } catch (e) {
          console.log(e);
          Alert.alert(" خطأ !", "حدث خطأ، يرجى إعادة التحميل ", [
            { text: "موافق", style: "default" },
          ]);
        } finally {
          setLoading(false);
          console.log("saved array : ", saved);
          console.log("itemsPerCategory : ", SavedItems);
        }
      };

      prepareData();
    }, [])
  );

  return (
    <BgWrapper>
      <ScreenTitle title="المحفوظات" />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color={textColor} />
        </View>
      ) : (
        <>
          <View
            className={`flex-row items-center gap-5 ${
              currentTheme === "dark" ? "bg-[#222222]" : "bg-primary"
            }  px-5`}
          >
            {saved.map((cat) => (
              <TouchableOpacity
                className="relative py-5"
                key={cat.id}
                onPress={() => setSelectedCat(cat.id)}
              >
                <ThemedText className="font-cairo">{cat.name}</ThemedText>

                <View
                  className={`bg-accent absolute bottom-0 right-0 w-full h-1 rounded-full`}
                ></View>
              </TouchableOpacity>
            ))}
          </View>
          <View className="flex-1">
            {Array.isArray(SavedItems) && SavedItems.length > 0 ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                {SavedItems.reverse().map((item, index) => {
                  const isLast = index === SavedItems.length - 1;
                  return (
                    <View
                      className={`p-5 flex-row items-center border-t-[.5px] ${
                        currentTheme === "dark"
                          ? " border-t-light/10"
                          : "border-t-dark/20"
                      }
                      ${isLast && "mb-16"}
                      `}
                      key={item.id}
                    >
                      <View className="flex-row items-center gap-2">
                        <UnSavedSvg
                          width={24}
                          height={24}
                          stroke={textColor}
                          strokeWidth={1}
                        />
                        <ThemedText className="text-sm font-cairo">
                          {item.name}
                        </ThemedText>
                      </View>

                      <View className="ml-auto flex-row items-center gap-5">
                        <TouchableOpacity
                          onPress={() =>
                            // @ts-ignore
                            router.push(item.route)
                          }
                        >
                          <QuranSvg
                            width={24}
                            height={24}
                            stroke={textColor}
                            strokeWidth={1}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedItem(item);
                            setVisible((prev) => !prev);
                          }}
                        >
                          <TrashSvg width={24} height={24} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            ) : (
              <View className="flex-1 justify-center items-center gap-3 opacity-65">
                <QuranSvg width={32} height={32} stroke={textColor} />
                <ThemedText className="font-cairo">
                  لا توجد محفوظات حتى الآن
                </ThemedText>
              </View>
            )}
          </View>
        </>
      )}

      <Modal
        isVisible={visible}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        coverScreen={false}
        className="rounded-2xl"
      >
        <View className="p-5 gap-5 bg-light rounded-2xl">
          <View className="items-center">
            <Text className="font-cairo-bold text-md">
              هل أنت متأكد من حذف هذه العلامة المرجعية ؟
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              className="bg-red-300 px-5 py-3 rounded-xl flex-1"
              onPress={handleRemove}
            >
              <Text className="font-cairo-bold text-md text-red-500 text-center">
                حذف
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-400 px-5 py-3 rounded-xl flex-1"
              onPress={() => setVisible(false)}
            >
              <Text className="font-cairo-bold text-md text-light text-center">
                إلغاء
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </BgWrapper>
  );
};

export default Saved;
