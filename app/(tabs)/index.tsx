import BgWrapper from "@/components/BgWrapper";
import DiscoverCard from "@/components/DiscoverCard";
import ScreenTitle from "@/components/ScreenTitle";
import ThemedText from "@/components/ThemedText";
import { ClockSvg, KabaaSvg, LocationSvg } from "@/constants/icons";
import { images } from "@/constants/images";
import { useTheme } from "@/context/ThemeContext";
import { ILocation, IPrayerDetails } from "@/interfaces";
import { getCurrentSalah } from "@/utils/getCurrentSalah";
import { convert24To12 } from "@/utils/parseTime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, TouchableOpacity, View } from "react-native";
import ayat from "../../assets/data/ayat.json";
import discoverCards from "../../assets/data/discoverSection.json";

const Index = () => {
  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

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
        // await AsyncStorage.removeItem("onboardingCompleted");
        const location = await AsyncStorage.getItem("location");
        setCurrentLocation(location ? JSON.parse(location) : null);

        const date = new Date();

        const formatedDate = date.toLocaleDateString(
          "ar-SA-u-ca-islamic-umalqura",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        );
        setToday(formatedDate);

        const storedTimings = await AsyncStorage.getItem("timings");
        const timings = storedTimings ? JSON.parse(storedTimings) : [];

        setPrayersDetails(timings);

        // detect current salah
        const current = getCurrentSalah(timings);
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
    setIsFriday(now.getDay() === 5);
  }, []);

  return (
    <BgWrapper className="px-5">
      <View className="flex-1">
        <ScreenTitle title="الصفحة الرئيسية" className="justify-between">
          <TouchableOpacity
            className={`flex flex-row items-center px-2 py-1 gap-1  ${
              currentTheme === "dark"
                ? "border-[.5px] border-light/20"
                : "border-[.5px] border-dark/20"
            } rounded-xl`}
            style={{ backgroundColor: bg }}
            onPress={() => router.push("/Settings/EditLocation")}
          >
            <ThemedText className="text-sm">
              {currentLocation?.city || "N/A"}
            </ThemedText>
            <LocationSvg
              width={20}
              height={20}
              stroke={textColor}
              strokeWidth={1}
            />
          </TouchableOpacity>
        </ScreenTitle>

        <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
          <View className="flex-1 py-5">
            <View>
              <ThemedText className="my-5 text-lg font-cairo-bold">
                السلام عليكم ، أخي المسلم
              </ThemedText>
              <TouchableOpacity
                className={`flex flex-row justify-between px-4 py-3 ${
                  currentTheme === "dark"
                    ? "border-[.5px] border-light/20"
                    : "border-[.5px] border-dark/20"
                } rounded-2xl`}
                style={{ backgroundColor: bg }}
              >
                <View className="flex-col justify-center">
                  <ThemedText className=" text-lg font-cairo-bold">
                    {currentSalah?.name || "N/A"}
                  </ThemedText>
                  <View className="flex-row items-center gap-2">
                    <ClockSvg width={18} stroke={textColor} strokeWidth={1} />
                    <ThemedText className="text-3xl font-cairo-light">
                      {convert24To12(currentSalah?.time || "12:00 AM")}
                    </ThemedText>
                  </View>
                </View>
                <View className="items-center gap-3 font-cairo text-xs">
                  <ThemedText className="text-md font-cairo-bold ">
                    {" "}
                    {today}
                  </ThemedText>
                  <Image source={images.kabaaBg} className="size-28" />
                </View>
              </TouchableOpacity>
            </View>
            {isFriday && (
              <View
                className={`my-5 rounded-2xl ${
                  currentTheme === "dark"
                    ? "border-[.5px] border-light/20"
                    : "border-[.5px] border-dark/20"
                } px-4 py-3`}
                style={{ backgroundColor: bg }}
              >
                <View className="flex-row gap-2 items-center max-h-8">
                  <KabaaSvg width={20} />
                  <ThemedText className="font-cairo-bold">
                    ساعة الجمعة
                  </ThemedText>
                </View>
                <ThemedText className="font-amiri">
                  عَن أبي هريرة أَنَّ رَسُولَ اللَّهِ ﷺ ذَكَرَ يَوْمَ
                  الجُمُعَةِ، فَقَالَ:{" "}
                  <ThemedText className="font-amiri-bold">
                    فِيه سَاعَةٌ لا يُوَافِقها عَبْدٌ مُسلِمٌ، وَهُو قَائِمٌ
                    يُصَلِّي يسأَلُ اللَّه شَيْئًا، إِلاَّ أَعْطَاهُ إِيَّاه .
                  </ThemedText>
                </ThemedText>
                <ThemedText className="font-amiri ml-auto">
                  متفق عليه
                </ThemedText>
              </View>
            )}
            <View>
              <ThemedText className="my-5 font-cairo-bold text-lg">
                استكشف
              </ThemedText>
              <View className="flex-row gap-2 flex-wrap">
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
            <ThemedText className="my-5 text-lg font-cairo-bold">
              مواقيت الصلاة
            </ThemedText>
            <View
              className={`items-center gap-7 px-4 py-5 rounded-2xl ${
                currentTheme === "dark"
                  ? "border-[.5px] border-light/20"
                  : "border-[.5px] border-dark/20"
              }`}
              style={{ backgroundColor: bg }}
            >
              <ThemedText className="text-xl text-center font-amiri-bold">
                فَذَالكٌم الرباط ، فَذَالكٌم الرباط
              </ThemedText>
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
                            ? "bg-accent"
                            : "bg-[#ddd]"
                        } rounded-full`}
                      />
                      <ThemedText className="font-cairo-bold text-sm text-dark">
                        {prayer.name}
                      </ThemedText>
                      <ThemedText className="text-xs font-cairo opacity-65">
                        {convert24To12(prayer.time)}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View className="mb-[65px]">
            <View
              className={`py-4 px-5 rounded-2xl ${
                currentTheme === "dark"
                  ? "border-[.5px] border-light/20"
                  : "border-[.5px] border-dark/20"
              }`}
              style={{ backgroundColor: bg }}
            >
              <ThemedText className="mb-2 text-md font-cairo-bold">
                الآية اليومية
              </ThemedText>
              <ThemedText className="text-md text- font-amiri-bold">
                {randomAyah ||
                  "إِنَّ ٱلَّذِينَ قَالُوا۟ رَبُّنَا ٱللَّهُ ثُمَّ ٱسْتَقَٰمُوا۟ تَتَنَزَّلُ عَلَيْهِمُ ٱلْمَلَٰٓئِكَةُ أَلَّا تَخَافُوا۟ وَلَا تَحْزَنُوا۟ وَأَبْشِرُوا۟ بِٱلْجَنَّةِ ٱلَّتِى كُنتُمْ تُوعَدُونَ"}
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </View>
    </BgWrapper>
  );
};

export default Index;
