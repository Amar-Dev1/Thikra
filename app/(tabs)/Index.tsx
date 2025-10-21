import DiscoverCard from "@/components/DiscoverCard";
import MainTitle from "@/components/MainTitle";
import { ClockSvg, KabaaSvg, LocationSvg } from "@/constants/icons";
import { images } from "@/constants/images";
import { ILocation, IPrayerDetails } from "@/interfaces";
import { convert24To12 } from "@/utils/convert24To12";
import { getCurrentSalah } from "@/utils/getCurrentSalah";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ayat from "../../assets/data/ayat.json";
import discoverCards from "../../assets/data/discoverSection.json";

const Index = () => {
  const [currentLocation, setCurrentLocation] = useState<ILocation | null>(
    null
  );

  const [currentSalah, setCurrentSalah] = useState<IPrayerDetails | null>(null);
  const [randomAyah, setRandomAyah] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>("");
  const [isFriday, setIsFriday] = useState<boolean>(false);

  const [prayersDetails, setPrayersDetails] = useState<IPrayerDetails[]>([
    { key: 1, name: "الفجر", enName: "Fajr", time: "", to: "" },
    { key: 2, name: "الظهر", enName: "Dhuhr", time: "", to: "" },
    { key: 3, name: "العصر", enName: "Asr", time: "", to: "" },
    { key: 4, name: "المغرب", enName: "Maghrib", time: "", to: "" },
    { key: 5, name: "العشاء", enName: "Isha", time: "", to: "" },
  ]);

  // prepare data
  useEffect(() => {
    async function prepareData() {
      try {
        const location = await AsyncStorage.getItem("location");
        setCurrentLocation(location ? JSON.parse(location) : null);

        const date = new Date();
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "long",
          day: "numeric",
          calendar: "islamic",
        };
        setToday(date.toLocaleDateString("ar-SA", options));

        const timingsRaw = await AsyncStorage.getItem("timings");
        const timings = timingsRaw ? JSON.parse(timingsRaw) : {};

        const updated = prayersDetails.map((prayer, idx) => {
          const from = timings[prayer.enName];
          const next = prayersDetails[(idx + 1) % prayersDetails.length];
          const to = timings[next.enName] ?? "N/A";
          return {
            ...prayer,
            time: from,
            to,
          };
        });

        setPrayersDetails(updated);

        // detect current salah
        const current = getCurrentSalah(updated);
        setCurrentSalah(current ? current : null);

        // set daily ayah

        let randomIndex = Math.floor(Math.random() * ayat.length);
        let randomAyah = ayat[randomIndex];
        setRandomAyah(randomAyah.ayah);
      } catch (e) {
        console.error("Faild to prepare data", e);
      }
    }
    prepareData();
  }, []);

  // for checking current salah every 1 minute
  useEffect(() => {
    let intervalId = setInterval(() => {
      const newSalah = getCurrentSalah(prayersDetails);
      setCurrentSalah((pervSalah) => {
        if (pervSalah?.key !== newSalah?.key) {
          return newSalah;
        }
        return pervSalah;
      });
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [prayersDetails]);

  // for handling friday message
  useEffect(() => {
    const now = new Date();
    setIsFriday(now.getDay() === 5 && now.getHours() === 14);
  }, []);

  return (
    <SafeAreaView
      className="flex-1 bg-bgColor px-5"
      style={{ direction: "rtl" }}
    >
      <View className="flex-row justify-between items-center border-b-2 border-primary">
        <MainTitle title="الصفحة الرئيسية" />
        <TouchableOpacity
          className="flex flex-row items-center gap-1 px-2 h-1/2 bg-primary rounded-xl"
          onPress={() => router.push("/Settings/EditLocation")}
        >
          <Text className="font-bold">{currentLocation?.city || "N/A"}</Text>
          <LocationSvg width={30} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="mb-[65px]"
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 py-5">
          <View>
            <Text className="my-5 text-xl font-cairo-bold">
              السلام عليكم ، أخي المسلم
            </Text>
            <TouchableOpacity className="flex flex-row justify-between px-4 py-3 bg-primary rounded-2xl">
              <View className="flex-col justify-center">
                <Text
                  className="opacity-60 text-lg"
                  style={{ fontFamily: "Cairo-Bold" }}
                >
                  {currentSalah?.name || "N/A"}
                </Text>
                <View className="flex-row items-center gap-2">
                  <ClockSvg width={20} className="opacity-60" />
                  <Text className="text-3xl font-cairo-light">
                    {convert24To12(currentSalah?.time || "12:00 AM")}
                  </Text>
                </View>
              </View>
              <View className="flex-col items-center">
                <Text
                  className="text-lg opacity-60"
                  style={{ fontFamily: "Cairo-Bold" }}
                >
                  {" "}
                  {today}
                </Text>
                <Image source={images.mosque} className="size-32" />
              </View>
            </TouchableOpacity>
          </View>
          {isFriday && (
            <View className="my-5 bg-primary rounded-2xl shadow-md px-4 py-3">
              <View className="flex-row gap-2 items-center max-h-8">
                <KabaaSvg width={20} />
                <Text className="font-cairo-bold">ساعة الجمعة</Text>
              </View>
              <Text className="font-amiri">
                عَن أبي هريرة أَنَّ رَسُولَ اللَّهِ ﷺ ذَكَرَ يَوْمَ الجُمُعَةِ،
                فَقَالَ:{" "}
                <Text className="font-amiri-bold">
                  فِيه سَاعَةٌ لا يُوَافِقها عَبْدٌ مُسلِمٌ، وَهُو قَائِمٌ
                  يُصَلِّي يسأَلُ اللَّه شَيْئًا، إِلاَّ أَعْطَاهُ إِيَّاه .
                </Text>
              </Text>
              <Text className="font-amiri ml-auto">متفق عليه</Text>
            </View>
          )}

          <View>
            <Text
              className="my-5 text-2xl"
              style={{ fontFamily: "Cairo-Bold" }}
            >
              استكشف
            </Text>
            <View className=" flex-row gap-2 flex-wrap">
              {discoverCards.map((card) => (
                <DiscoverCard
                  key={card.id}
                  {...card}
                  image={(images as any)[card.image]}
                  className="min-w-[31%] flex-1"
                  route={card.route}
                />
              ))}
            </View>
          </View>
        </View>

        <View className="mb-5">
          <Text className="my-5 text-xl font-cairo-bold">مواقيت الصلاة</Text>
          <View className="items-center gap-7 px-4 py-5 bg-primary rounded-2xl shadow-md">
            <Text className="text-xl text-center font-amiri-bold">
              فَذَالكٌم الرباط ، فَذَالكٌم الرباط
            </Text>
            <View className="relative w-[95%] mx-auto mb-4">
              <View className="absolute top-[5.5px] w-full h-[1.5px] bg-[#ddd]" />

              <View className="flex flex-row justify-between">
                {prayersDetails.map((prayer) => (
                  <TouchableOpacity
                    key={prayer.key}
                    className="flex flex-col items-center gap-2 "
                  >
                    <View
                      className={`w-3 h-3 ${
                        currentSalah?.key === prayer.key
                          ? "bg-dark"
                          : "bg-[#ddd]"
                      }  rounded-full`}
                    />
                    <Text className="font-cairo-bold text-sm text-dark">
                      {prayer.name}
                    </Text>
                    <Text className="text-sm font-cairo opacity-65">
                      {convert24To12(prayer.time)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View className="mb-3">
          <View className="bg-primary py-4 px-5 rounded-2xl shadow-md">
            <Text className="mb-2 text-md font-cairo-bold">تذكرة</Text>
            <Text className="text-md text- font-amiri-bold">
              {randomAyah ||
                "إِنَّ ٱلَّذِينَ قَالُوا۟ رَبُّنَا ٱللَّهُ ثُمَّ ٱسْتَقَٰمُوا۟ تَتَنَزَّلُ عَلَيْهِمُ ٱلْمَلَٰٓئِكَةُ أَلَّا تَخَافُوا۟ وَلَا تَحْزَنُوا۟ وَأَبْشِرُوا۟ بِٱلْجَنَّةِ ٱلَّتِى كُنتُمْ تُوعَدُونَ"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Index;
