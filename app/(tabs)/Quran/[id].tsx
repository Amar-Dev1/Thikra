import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import { MoonSvg, NextSvg, PauseSvg, PlaySvg } from "@/constants/icons";
import { images } from "@/constants/images";
import { ISurah } from "@/interfaces";
import { fetchSurahAudio } from "@/services/fetchQuran";
import { File, Paths } from "expo-file-system";
import { useLocalSearchParams } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AllSurahs from "../../../assets/data/quran_surahs.json";

const ListenSurah = () => {
  const { id } = useLocalSearchParams();

  const [loading, setLoading] = useState<null | boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  // @ts-ignore
  const selectedSurah: ISurah = AllSurahs.find(
    (surah) => surah.id === Number(id)
  );

  useEffect(() => {
    const prepareAudio = async () => {
      try {
        setLoading(true);
        setErrMsg(null);

        const file = new File(Paths.document, `${id}.mp3`);
        if (!file.exists) {
          const uri = await fetchSurahAudio(Number(id));
          setAudioFile(uri);
        }
        setAudioFile(file.uri);
      } catch (e) {
        console.log(e);
        alert("خطأ في تحميل الملف الصوتي !");
      } finally {
        setLoading(false);
      }
    };
  }, []);

  return (
    <BgWrapper className="px-5 gap-3">
      <View className="border-b-[.5px] border-gray-400 py-3">
        <MainTitle title={` سماع سورة ${selectedSurah?.name}`} />
      </View>
      <View className="ml-auto flex-row items-center gap-3 mt-3">
        <Text>القارئ </Text>
        <TouchableOpacity className="bg-primary py-2 px-4 rounded-2xl shadow-md flex justify-center items-center">
          <Text className="font-cairo text-xs">قراءة متنوعة</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center gap-20 items-center">
        <View className="relative bg-[#172448] w-[90%] h-[45%] rounded-full items-center justify-center">
          <Image
            source={images.kabaaBg}
            resizeMode="contain"
            className="h-[65%] w-[65%]"
          />
          <View className="absolute top-[15%] right-[30%] opacity-95">
            <MoonSvg width={24} height={24} />
          </View>
        </View>
        <View className="h-[25%] justify-around">
          <View className="bg-[#ccc] h-2 w-[85%] rounded-full flex-row justify-end">
            <View className="relative bg-dark w-1/2 h-full rounded-full">
              <TouchableOpacity className="absolute bg-dark top-1/2 -translate-y-1/2 left-0 w-5 h-5 rounded-full"></TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center justify-around">
            <TouchableOpacity>
              <NextSvg width={34} height={34} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPaused(!paused)}>
              {!paused ? (
                <PauseSvg width={34} height={34} />
              ) : (
                <PlaySvg width={34} height={34} />
              )}
            </TouchableOpacity>

            <TouchableOpacity className="rotate-180">
              <NextSvg width={34} height={34} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </BgWrapper>
  );
};

export default ListenSurah;
