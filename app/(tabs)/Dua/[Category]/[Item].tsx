import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import ShareDua from "@/components/ShareDua";
import { ShareSvg, UnSavedSvg } from "@/constants/icons";
import { ISavedCategory } from "@/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isRunningInExpoGo } from "expo";
import {
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import adhkar from "../../../../assets/data/adhkar.json";

const ItemDetails = () => {
  const { Item, Category } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const shareViewRef = useRef<ViewShot>(null);

  const categoryId = Number(Category);
  const itemId = Number(Item);

  const category = adhkar.find((c) => c.id === categoryId);
  const currentItem =
    category?.items.find((item) => item.id === itemId) ?? null;

  useEffect(() => {
    const checkIfSaved = async () => {
      const data = await AsyncStorage.getItem("Saved");
      const saved: ISavedCategory[] = data ? JSON.parse(data) : [];
      const category = saved.find((cat) => cat.name === "Dua");
      if (category) {
        const itemExists = category.items.some((item) => item.id === itemId);
        setIsSaved(itemExists);
      }
    };

    checkIfSaved();
  }, [itemId]);
  useFocusEffect(
    useCallback(() => {
      // @ts-ignore
      const tabsParent = navigation.getParent()?.getParent("/(tabs)");
      if (tabsParent) {
        tabsParent.setOptions({
          tabBarStyle: { display: "none" },
        });
      }
      return () => {
        if (tabsParent) {
          console.log("Restoring original tab bar.");
          // Restore the original tab bar
          tabsParent.setOptions({
            tabBarStyle: {
              backgroundColor: "#FFFDF8",
              borderTopWidth: 0.5,
              minHeight: 70,
              position: "absolute",
              overflow: "hidden",
            },
          });
        }
      };
    }, [navigation]) // Dependency array
  );
  const toggleSave = async (id: number) => {
    try {
      setLoading(true);
      const data = await AsyncStorage.getItem("Saved");
      const saved: ISavedCategory[] = data ? JSON.parse(data) : [];

      const category = saved.find((cat) => cat.name === "Dua");

      if (category) {
        const itemIndex = category.items.findIndex((item) => item.id === id);
        if (itemIndex > -1) {
          // Item is already saved, remove it
          category.items.splice(itemIndex, 1);
          setIsSaved(false); // Update state
        } else {
          // Item is not saved, add it
          category.items.push({
            id,
            route: `/Dua/${categoryId}/${id}`,
            name: currentItem?.name,
          });
          setIsSaved(true); // Update state
        }
      } else {
        // If the category doesn't exist, create it
        saved.push({
          name: "Dua",
          items: [
            { id, route: `/Dua/${categoryId}/${id}`, name: currentItem?.name },
          ],
        });
        setIsSaved(true); // Update state
      }

      await AsyncStorage.setItem("Saved", JSON.stringify(saved));
    } catch (e) {
      console.log(e);
      Alert.alert("خطأ", "لم يتم الحفظ", [{ text: "موافق", style: "default" }]);
    } finally {
      setLoading(false);
    }
  };

  const onShare = async () => {
    if (!shareViewRef.current) {
      console.log("ViewShot ref is not available.");
      return;
    }
    if (!isRunningInExpoGo()) {
      try {
        // 1. Capture the ViewShot to get the local file URI
        // @ts-ignore
        const uri = await shareViewRef.current.capture({
          format: "png",
          quality: 0.9,
          result: "tmpfile",
        });

        const link = "Download Thikra here:\nhttps://github.com/amar-dev1";

        // 2. Use the standard React Native Share API
        await Share.share({
          url: uri, // The image file URI
          title: currentItem?.name, // This is often ignored by WhatsApp
          message: `${currentItem?.name}\n\n${link}`, // Combine the name and the link
        });
      } catch (e) {
        console.log("Failed to share dua:", e);
        Alert.alert("خطأ", "فشل في المشاركة", [
          { text: "موافق", style: "default" },
        ]);
      }
    }
  };

  return (
    <BgWrapper className="px-5" hideBackground={true}>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: -9999, // Move it way off-screen
          zIndex: -100,
          opacity: 0,
          // Add these to ensure it has a size and renders its children
          width: 300, // Based on your ShareDua content size
          height: 300,
        }}
      >
        <ShareDua duaName={currentItem?.name || "Dua"} ref={shareViewRef} />
      </View>

      <View className="flex-row items-center justify-center py-4 border-b-[.5px] border-b-dark/20">
        <MainTitle title={currentItem?.name!} />
      </View>
      {loading ? (
        <View className="flex-1 justify-center">
          <ActivityIndicator size={"large"} color={"black"} />
        </View>
      ) : (
        <FlatList
          data={currentItem?.duas ?? []}
          keyExtractor={(d: any) => String(d.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            gap: 7,
            paddingBottom: 90,
          }}
          renderItem={({ item }) => {
            return (
              <View
                className={`px-5 py-7 border-[.5px] border-dark bg-primary rounded-xl`}
              >
                <Text className="font-amiri-bold text-lg">{item.text}</Text>
                {item.count != null && (
                  <Text className="opacity-60 text-xs mt-5">
                    عدد المرات: {item.count}
                  </Text>
                )}
              </View>
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
          minHeight: 70,
          backgroundColor: "#FFFDF8",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          borderTopWidth: 0.5,
          borderColor: "rgba(0,0,0,0.2)",
          paddingBottom: 5,
          zIndex: 100,
        }}
      >
        <TouchableOpacity
          onPress={() => toggleSave(itemId)}
          style={{ alignItems: "center", gap: 4, flex: 1, marginBottom: 8 }}
        >
          {
            <UnSavedSvg
              width={26}
              height={26}
              fill={isSaved ? "black" : "none"}
            />
          }
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onShare}
          style={{ alignItems: "center", gap: 4, flex: 1, marginBottom: 8 }}
        >
          <ShareSvg width={26} height={26} strokeWidth={100} />
        </TouchableOpacity>
      </View>
    </BgWrapper>
  );
};

export default ItemDetails;
