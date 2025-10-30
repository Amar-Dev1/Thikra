import { LocationSvg } from "@/constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import locations from "../../assets/data/locations.json";
import BgWrapper from "@/components/BgWrapper";
import { SelectList } from "react-native-dropdown-select-list";

const AccessLocation = () => {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [expandedCountry, setExpandedCountry] = useState(false);
  const [expandedCity, setExpandedCity] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>("");
  const [selectedCity, setSelectedCity] = useState<string | null>("");

  const countries = locations.map((c) => c.country);

  const selectedCountryData = locations.find(
    (c) => c.country === selectedCountry
  );
  const cities = selectedCountryData ? selectedCountryData.cities : [];

  const locationAutoDetect = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      try {
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        const addresses = await Location.reverseGeocodeAsync(coords);
        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          const resolvedCity =
            addr.city || addr.region || addr.subregion || addr.name || null;
          const resolvedCountry = addr.country || addr.isoCountryCode || null;

          await AsyncStorage.setItem(
            "location",
            JSON.stringify({ city: resolvedCity, country: resolvedCountry })
          );

          router.push("/onboarding/SetupAll");
        }
      } catch (e) {
        console.warn("Reverse geocode faild", e);
      }
    } catch (e) {
      console.error(e);
      Alert.alert(
        "تفعيل خدمة الموقع",
        "قم بتفعيل الموقع رجاءاً قم بتفعيل الموقع ليعمل التطبيق ",
        [{ text: "موافق", style: "default" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const locationManualDetect = async () => {
    try {
      setLoading(true);
      await AsyncStorage.setItem(
        "location",
        JSON.stringify({ city: selectedCity, country: selectedCountry })
      );
      router.push("/onboarding/SetupAll");
    } catch (e) {
      console.error("faild to process manual location", e);
    } finally {
      console.log(await AsyncStorage.getItem("location"));
      setLoading(false);
    }
  };

  // @ts-ignore , i dont have time !
  const isReady = selectedCountry?.length > 0 && selectedCity?.length > 0;

  return (
    <BgWrapper className={`px-5 ${loading && "justify-center items-center"}`}>
      {loading ? (
        <>
          <ActivityIndicator color={"black"} size={"large"} />
          <Text className="font-cairo-bold text-lg opacity-65 mt-5">
            جار ضبط الموقع
          </Text>
        </>
      ) : (
        <>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center gap-2">
              <Text className="font-cairo-bold text-3xl my-5">الموقع</Text>
            </View>
            <Text className="font-cairo text-xl opacity-65">
              تفعيل الوصول للموقع ، لعرض مواقيت الصلاة بناءاً على موقعك الحالي
            </Text>

            <View className="mt-5 gap-4">
              <TouchableOpacity
                className="bg-primary p-5 rounded-2xl shadow-md border border-primary"
                onPress={locationAutoDetect}
              >
                <View className="flex-row gap-3">
                  <LocationSvg width={32} height={32} />
                  <View className="gap-2 flex-1">
                    <Text className="font-cairo-bold text-lg">
                      تحديد الموقع تلقائياً{" "}
                      <Text className="text-sm font-cairo opacity-60">
                        (موصى به)
                      </Text>
                    </Text>
                    <Text className="font-cairo-bold text-sm opacity-55">
                      سيتم تحديث مواقيت الصلاة تلقائياً
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-primary p-5 rounded-2xl shadow-md border border-primary"
                onPress={() => setExpandedCountry(!expandedCountry)}
              >
                <View className="flex-row gap-3 ">
                  <LocationSvg width={32} height={32} />
                  <View className="gap-2 flex-1">
                    <Text className="font-cairo-bold text-lg">
                      تحديد الموقع يدوياً
                    </Text>
                    <Text className="font-cairo-bold text-sm opacity-55">
                      حدد البلد و المدينة يدوياً . عليك تحديث موقعك إذا غيرت
                      المدينة
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {expandedCountry && (
                <View className="mt-3">
                  <Text>اختار الدولة</Text>
                  <SelectList
                    data={countries}
                    setSelected={(value: string) => {
                      setSelectedCountry(value);
                      setExpandedCity(true);
                    }}
                    search={false}
                  />
                </View>
              )}

              {expandedCity && (
                <View className={`mt-3 mb-3`}>
                  <Text>اختار المدينة</Text>
                  <SelectList
                    data={cities}
                    setSelected={(value: string) => setSelectedCity(value)}
                    search={false}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          <View className="flex-row items-center mt-auto">
            <TouchableOpacity
              className={`bg-primary shadow-md ${
                !isReady ? "opacity-60" : "opacity-100"
              } rounded-2xl py-2 flex-1`}
              disabled={!isReady}
              onPress={locationManualDetect}
            >
              <Text className="text-lg font-cairo-bold text-center">
                التالي
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-2xl py-2 flex-1"
              onPress={router.back}
            >
              <Text className="text-lg font-cairo-bold text-center">
                الرجوع
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BgWrapper>
  );
};

export default AccessLocation;