import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import {
  MenuSvg,
  PlaySvg,
  QuranSvg,
  RightAngleSvg,
  SavedSvg,
  UnSavedSvg,
} from "@/constants/icons";
import { fetchQuranPart } from "@/services/fetchQuran";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, Paths } from "expo-file-system";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  TapGestureHandler,
} from "react-native-gesture-handler";
import Modal from "react-native-modal";
import quranSurahs from "../../../assets/data/quran_surahs.json";

const { width, height } = Dimensions.get("window");

const Index = () => {
  const [loading, setLoading] = useState<boolean | null>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [quranFound, setQuranFound] = useState<boolean | null>(null);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);
  const [zoom, setZoom] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [savedPages, setSavedPages] = useState<any[]>([]);

  // the page number that user enter to navigate
  const [pageNumberInput, setPageNumberInput] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<string>>(null);

  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setActiveIndex(index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const handleDownload = async () => {
    try {
      setErrMsg(null);
      setLoading(true);

      if (
        typeof from !== "number" ||
        typeof to !== "number" ||
        isNaN(from) ||
        isNaN(to)
      ) {
        setErrMsg("الرجاء إدخال أرقام صفحات صحيحة (من - إلى).");
        setLoading(false);
        return;
      }

      from && to && (await fetchQuranPart(from, to));
      await AsyncStorage.setItem("quranFound", "true");

      setVisible(false);
    } catch (e) {
      console.log(e);
      setErrMsg(
        "خطأ ! . إما أن تكون الصفحات محملة مسبقاً أو الرجاء التأكد من الإنترنت"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (tartgetIndex?: number) => {
    if (tartgetIndex) {
      if (tartgetIndex >= 1 && tartgetIndex <= imageUris.length) {
        setVisible(!visible);
        flatListRef.current?.scrollToIndex({
          index: tartgetIndex - 1,
          animated: true,
        });
        setActiveIndex(tartgetIndex);
      } else {
        alert("رقم الصفحة غير موجود أو لم يتم تحميله مسبقاً  !");
      }
      return;
    }

    const pageNumber = Number(pageNumberInput);

    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= imageUris.length
    ) {
      const targetIndex = pageNumber - 1;
      flatListRef.current?.scrollToIndex({
        index: targetIndex,
        animated: true,
      });
      setActiveIndex(targetIndex);
      setVisible(!visible);
    } else {
      alert("رقم الصفحة غير صحيح أو غير موجود !");
    }
  };

  useEffect(() => {
    const preparePages = async () => {
      try {
        const quranDir = new Directory(Paths.document, "quran");
        if (!quranDir.exists) {
          await AsyncStorage.setItem("quranFound", "false");
          setQuranFound(false);
        }

        const files = quranDir.list().map((file) => file);
        if (!files || files.length === 0) {
          setQuranFound(false);
          setImageUris([]);
          return;
        }

        const sortedFiles = files.sort((a, b) => {
          const aNum = parseInt(a.name.replace(/\D/g, ""), 10);
          const bNum = parseInt(b.name.replace(/\D/g, ""), 10);
          return aNum - bNum;
        });

        const uris = [];

        for (const file of sortedFiles) {
          if (file.exists) {
            uris.push(file.uri);
            setQuranFound(true);
          } else {
            console.warn(`page : ${file} not found`);
          }
        }

        setImageUris(uris);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    preparePages();
  }, []);

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const data = await AsyncStorage.getItem("Saved");
        const saved = data ? JSON.parse(data) : [];
        setSavedPages(Array.isArray(saved) ? saved : []);
      } catch (e) {
        console.log(e);
      }
    };
    loadSaved();
  }, []);

  const isPageSaved = (pageIndex: number) => {
    const pageNumber = pageIndex + 1;
    return savedPages.some(
      (s) => s.category === "Quran" && Number(s.pageNumber) === pageNumber
    );
  };

  const toggleSave = async (pageIndex: number) => {
    try {
      setErrMsg(null);
      setLoading(true);

      const data = await AsyncStorage.getItem("Saved");
      let saved = data ? JSON.parse(data) : [];
      if (!Array.isArray(saved)) saved = [];

      const pageNumber = pageIndex + 1;
      const existingIndex = saved.findIndex(
        (s: any) =>
          s.category === "Quran" && Number(s.pageNumber) === pageNumber
      );

      if (existingIndex > -1) {
        saved.splice(existingIndex, 1);
      } else {
        saved.push({
          id: pageNumber,
          category: "Quran",
          pageNumber,
        });
      }

      await AsyncStorage.setItem("Saved", JSON.stringify(saved));
      setSavedPages(saved);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <BgWrapper className="px-0 bg-bgColor" hideBackground={true}>
        <View className="w-full flex-row justify-between px-5 py-3 border-b-[.5px] border-gray-400">
          <MainTitle title="القرآن" />
          <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
            <MenuSvg width={32} height={32} />
          </TouchableWithoutFeedback>
        </View>

        {quranFound === null ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : quranFound ? (
          <View className="flex-1">
            <FlatList
              ref={flatListRef}
              data={imageUris}
              keyExtractor={(uri) => uri}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onViewableItemsChanged={onViewRef.current}
              viewabilityConfig={viewConfigRef.current}
              // initialNumToRender={1}
              // maxToRenderPerBatch={1}
              // windowSize={3}
              renderItem={({ item, index }) => (
                <TapGestureHandler
                  numberOfTaps={2}
                  onActivated={() => setZoom(!zoom)}
                >
                  <View>
                    <Image
                      source={{ uri: item }}
                      resizeMode={zoom ? "cover" : "contain"}
                      style={{ width: width, height: height - 145 }}
                    />

                    {!zoom && (
                      <TouchableOpacity
                        className="flex items-center"
                        onPress={() => toggleSave(index)}
                      >
                        {isPageSaved(index) ? (
                          <>
                            <SavedSvg width={32} height={32} />
                            <Text>محفوظه</Text>
                          </>
                        ) : (
                          <>
                            <UnSavedSvg width={32} height={32} />
                            <Text>حفظ</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                </TapGestureHandler>
              )}
            />
          </View>
        ) : (
          <View className={`flex-1 justify-center items-center`}>
            <Text className="font-cairo-bold text-lg">
              لم يتم العثور على محتوى
            </Text>
            <Text className="font-cairo text-base">
              الرجاء تحميل الصفحات من القائمة
            </Text>
          </View>
        )}

        <Modal
          isVisible={visible}
          swipeDirection={"left"}
          animationIn={"slideInLeft"}
          animationOut={"slideOutLeft"}
          animationInTiming={500}
          coverScreen={true}
          className="bg-primary rounded-2xl shadow-md"
        >
          <View className="flex-1 p-4 gap-2">
            <TouchableOpacity
              className="bg-light w-12 h-12 flex justify-center items-center rounded-full shadow-md rotate-180"
              onPress={() => setVisible(false)}
            >
              <RightAngleSvg width={30} height={30} className="" />
            </TouchableOpacity>

            <View className="justify-center gap-3 py-3">
              {!loading ? (
                <>
                  <Text className="font-cairo-bold text-sm">تحميل الصفحات</Text>
                  <View className="flex-row items-center gap-3">
                    <TextInput
                      placeholder="من صفحة"
                      className="flex-1 text-sm p-3 rounded-xl bg-light"
                      keyboardType="numeric"
                      maxLength={3}
                      value={from !== null ? String(from) : ""}
                      onChangeText={(value) => {
                        const n =
                          value.trim() === "" ? null : value.replace(/\D/g, "");
                        setFrom(Number(n));
                      }}
                    />
                    <TextInput
                      placeholder="إلى صفحة"
                      className="flex-1 text-sm p-3 rounded-xl bg-light"
                      keyboardType="numeric"
                      maxLength={3}
                      value={to !== null ? String(to) : ""}
                      onChangeText={(value) => {
                        const n =
                          value.trim() === "" ? null : value.replace(/\D/g, "");
                        setTo(Number(n));
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    className="bg-light py-2 px-5 mx-auto rounded-2xl shadow-md"
                    onPress={handleDownload}
                  >
                    <Text className="font-cairo-bold">تحميل</Text>
                  </TouchableOpacity>

                  <Text className="font-cairo-bold text-sm">
                    تنقّل بين الصفحات
                  </Text>
                  <View className="flex-row gap-5 items-center">
                    <Text className="font-cairo text-sm">أنتقل إلى</Text>
                    <TextInput
                      placeholder="إلى صفحة"
                      className="flex-1 text-sm p-3 rounded-xl bg-light"
                      keyboardType="numeric"
                      maxLength={3}
                      onChangeText={(value) => setPageNumberInput(value)}
                    />
                  </View>
                  <TouchableOpacity
                    className="bg-light py-2 px-5 mx-auto rounded-2xl shadow-md"
                    onPress={() => handleNavigate()}
                  >
                    <Text className="font-cairo-bold">أنتقل</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text className="font-cairo-bold text-center">
                    جار التحميل من صفحة {from} إلى صفحة {to}
                  </Text>
                  <ActivityIndicator size={"large"} color={"black"} />{" "}
                </>
              )}
              {errMsg && (
                <Text className="text-center font-red-400 font-cairo-bold text-sm">
                  {errMsg}
                </Text>
              )}
            </View>
            <Text className="font-cairo-bold text-sm">جميع السور</Text>
            <FlatList
              data={quranSurahs}
              keyExtractor={(surah) => surah.id}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <View className="flex-row items-center bg-light mb-[1px] py-3 px-4 shadow-md">
                  <Text className="font-cairo-light text-xs">{item.id}. </Text>
                  <Text className="font-cairo-bold opacity-65 text-sm">
                    {item.name}
                  </Text>
                  <View className="flex-row gap-5 ml-auto items-center">
                    <QuranSvg
                      width={22}
                      height={22}
                      onPress={() => handleNavigate(item.from)}
                    />
                    <PlaySvg
                      width={20}
                      height={20}
                      onPress={() =>
                        router.push(`/(tabs)/Quran/${index + 1}`)
                      }
                    />
                  </View>
                </View>
              )}
              className="border border-gray-400 rounded-lg"
            />
          </View>
        </Modal>
      </BgWrapper>
    </GestureHandlerRootView>
  );
};

export default Index;
