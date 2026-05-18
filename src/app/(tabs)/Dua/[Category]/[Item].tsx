import BgWrapper from "@/src/components/BgWrapper";
import ScreenTitle from "@/src/components/ScreenTitle";
import ShareDua from "@/src/components/ShareDua";
import ThemedText from "@/src/components/ThemedText";
import { SavedSvg, ShareSvg, UnSavedSvg } from "@/src/constants/icons";
import { useTheme } from "@/src/context/ThemeContext";
import { ISavedCategory } from "@/src/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import adhkar from "../../../../../assets/data/adhkar.json";

const ItemDetails = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#ffffff";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const { Item, Category } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const shareViewRef = useRef<ViewShot>(null);

  const categoryId = Number(Category);
  const itemId = Item;

  const category = adhkar.find((c) => c.id === categoryId);
  const allItems = (category?.items ?? []) as any[];
  const currentItem =
    allItems.find((item) => String(item.id) === String(itemId)) ?? null;

  useFocusEffect(
    useCallback(() => {
      const checkIfSaved = async () => {
        const data = await AsyncStorage.getItem("Saved");
        const saved: ISavedCategory[] = data ? JSON.parse(data) : [];
        
        // Search all items in case the state hasn't been consolidated yet
        const allItems = saved.flatMap(cat => cat.items || []);
        const itemExists = allItems.some((item) => String(item.id) === String(itemId));
        setIsSaved(itemExists);
      };

      checkIfSaved();

      return () => {};
    }, [itemId])
  );



  const toggleSave = async () => {
    if (!currentItem) return;

    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("Saved");
      let saved: ISavedCategory[] = data ? JSON.parse(data) : [];

      // Consolidate all categories into a single one to clean up bad state
      const allItems = saved.flatMap(cat => cat.items || []);
      // Remove duplicates
      const uniqueItems = Array.from(new Map(allItems.map(item => [String(item.id), item])).values());
      
      saved = [{
        id: 1,
        name: "أدعية وأذكار",
        items: uniqueItems
      }];

      const category = saved[0];
      const itemIndex = category.items.findIndex(
        (item) => String(item.id) === String(currentItem?.id)
      );

      if (itemIndex > -1) {
        category.items.splice(itemIndex, 1);
        setIsSaved(false);
      } else {
        category.items.push({
          id: currentItem?.id,
          route: `/Dua/${categoryId}/${currentItem.id}`,
          name: currentItem?.name,
        });
        setIsSaved(true);
      }

      await AsyncStorage.setItem("Saved", JSON.stringify(saved));
      // DeviceEventEmitter.emit('SavedUpdated')
    } catch (e) {
      console.log(e);
      Alert.alert("خطأ", "لم يتم الحفظ", [
        { text: "موافق", style: "default" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onShare = async () => {
    if (!shareViewRef.current) {
      console.log("ViewShot ref is not available.");
      return;
    }
    try {
      // @ts-ignore
      const uri = await shareViewRef.current.capture({
        format: "png",
        quality: 0.9,
        result: "tmpfile",
      });

      await Sharing.shareAsync(uri);
    } catch (e) {
      console.log("Failed to share dua:", e);
      Alert.alert("خطأ", "فشل في المشاركة", [
        { text: "موافق", style: "default" },
      ]);
    }
  };

  return (
    <BgWrapper className="px-5">
      <View
        style={{
          position: "absolute",
          left: 0,
          top: -9999,
          zIndex: -100,
          opacity: 0,
          width: 300,
          height: 300,
        }}
      >
        <ShareDua
          duaName={currentItem?.name || "Dua"}
          firstDua={currentItem?.duas[0].text}
          count={currentItem?.duas[0].count}
          ref={shareViewRef}
        />
      </View>

      <ScreenTitle title={currentItem?.name!} />

      {loading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      ) : (
        <FlatList
          data={currentItem.duas ?? []}
          keyExtractor={(d: any) => String(d.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            gap: 10,
            paddingBottom: 90,
            paddingTop: 10,
          }}
          renderItem={({ item, index }) => {
            return (
              <Animated.View
                entering={FadeInRight.springify().delay(index * 100)}
                className={`px-5 py-7 rounded-2xl ${
                  currentTheme === "dark"
                    ? "border-[.5px] border-light/10"
                    : "border-[.5px] border-dark/20"
                }`}
                style={{ backgroundColor: bg }}
              >
                <ThemedText className="font-amiri-bold text-lg">
                  {item.text}
                </ThemedText>
                {item.count != null && (
                  <ThemedText className="opacity-60 text-xs mt-5">
                    عدد المرات:  {item.count}
                  </ThemedText>
                )}
              </Animated.View>
            );
          }}
        />
      )}
      <View
        style={{
          position: "absolute",
          bottom: insets.bottom - 15,
          left: 0,
          right: 0,
          minHeight: 60,
          backgroundColor: bg,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          borderTopWidth: 0.5,
          borderColor: currentTheme === "dark" ? "#333333" : "#888888",
          paddingBottom: 5,
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          onPress={toggleSave}
          style={{ alignItems: "center", gap: 4, flex: 1, marginBottom: 8 }}
        >
          {isSaved ? (
            <SavedSvg
              width={22}
              height={22}
              stroke={"#F5C97B"}
              strokeWidth={1}
            />
          ) : (
            <UnSavedSvg
              width={22}
              height={22}
              stroke={textColor}
              strokeWidth={1}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          style={{ alignItems: "center", gap: 4, flex: 1, marginBottom: 8 }}
        >
          <ShareSvg width={22} height={22} stroke={textColor} strokeWidth={1} />
        </TouchableOpacity>
      </View>
    </BgWrapper>
  );
};

export default ItemDetails;
