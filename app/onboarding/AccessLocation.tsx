import BgWrapper from "@/components/BgWrapper";
import ThemedText from "@/components/ThemedText";
import { LocationSvg } from "@/constants/icons";
import { useTheme } from "@/context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import locations from "../../assets/data/locations.json";

const AccessLocation = () => {
  const insets = useSafeAreaInsets();

  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const [loading, setLoading] = useState<boolean | null>(null);
  const [expandedCountry, setExpandedCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>("");
  const [selectedCity, setSelectedCity] = useState<string | null>("");

  const countries = locations.map((c) => c.country);

  const selectedCountryData = locations.find(
    (c) => c.country === selectedCountry
  );

  const cities = selectedCountryData ? selectedCountryData.cities : [];
  const cityNames = cities.map((c) => c.name);

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
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      let city = "unknown";
      let country = "unknown";
      try {
        const addresses = await Location.reverseGeocodeAsync(coords);
        if (addresses && addresses.length > 0) {
          const addr = addresses[0];
          // @ts-ignore
          city =
            addr.city || addr.region || addr.subregion || addr.name || null;
          // @ts-ignore
          country = addr.country || addr.isoCountryCode || null;

          await AsyncStorage.setItem(
            "location",
            JSON.stringify({
              latitude: coords.latitude,
              longitude: coords.longitude,
              city: city,
              country: country,
              method: "auto",
            })
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
    if (!selectedCity || !selectedCountry) return;
    try {
      setLoading(true);

      const cityData = cities.find((c) => c.name === selectedCity);

      if (!cityData) {
        Alert.alert("خطأ", "تعذر إيجاد المدينة", [
          { text: "موافق", style: "default" },
        ]);
        throw new Error("Could not find city data");
      }

      await AsyncStorage.setItem(
        "location",
        JSON.stringify({
          latitude: cityData.latitude,
          longitude: cityData.longitude,
          city: cityData.name,
          country: selectedCountry,
          method: "manual",
        })
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
  const isReady = !!selectedCountry && !!selectedCity;

  return (
    <BgWrapper className={`px-5 ${loading && "justify-center items-center"}`}>
      {loading ? (
        <Modal
          visible={loading}
          transparent
          statusBarTranslucent
          animationType="fade"
        >
          <View
            className="flex-1 gap-8 justify-center items-center"
            style={{ backgroundColor: bg, paddingBottom: insets.bottom }}
          >
            <ActivityIndicator color={textColor} size={"large"} />
            <ThemedText className="font-cairo-bold text-lg opacity-65">
              جار ضبط الموقع
            </ThemedText>
          </View>
        </Modal>
      ) : (
        <>
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="flex-row items-center gap-2">
              <ThemedText className="font-cairo-bold text-3xl my-5">
                الموقع
              </ThemedText>
            </View>
            <ThemedText className="font-cairo text-xl opacity-65">
              تفعيل الوصول للموقع ، لعرض مواقيت الصلاة بناءاً على موقعك الحالي
            </ThemedText>

            <View className="mt-5 gap-4">
              <TouchableOpacity
                className={`p-5 rounded-2xl border ${
                  currentTheme === "dark" ? "border-light/20" : "borde-dark/10"
                }`}
                style={{ backgroundColor: bg }}
                onPress={locationAutoDetect}
              >
                <View className="flex-row gap-3">
                  <LocationSvg
                    width={24}
                    height={24}
                    stroke={textColor}
                    strokeWidth={1}
                  />
                  <View className="gap-2 flex-1">
                    <ThemedText className="font-cairo-bold text-lg">
                      تحديد الموقع تلقائياً{" "}
                      <ThemedText className="text-sm font-cairo opacity-60">
                        (موصى به)
                      </ThemedText>
                    </ThemedText>
                    <ThemedText className="font-cairo-bold text-sm opacity-55">
                      سيتم تحديث مواقيت الصلاة تلقائياً
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`p-5 rounded-2xl border ${
                  currentTheme === "dark" ? "border-light/20" : "borde-dark/10"
                }`}
                style={{ backgroundColor: bg }}
                onPress={() => setExpandedCountry(!expandedCountry)}
              >
                <View className="flex-row gap-3 ">
                  <LocationSvg
                    width={24}
                    height={24}
                    stroke={textColor}
                    strokeWidth={1}
                  />
                  <View className="gap-2 flex-1">
                    <ThemedText className="font-cairo-bold text-lg">
                      تحديد الموقع يدوياً
                    </ThemedText>
                    <ThemedText className="font-cairo-bold text-sm opacity-55">
                      حدد البلد و المدينة يدوياً . عليك تحديث موقعك إذا غيرت
                      المدينة
                    </ThemedText>
                  </View>
                </View>
              </TouchableOpacity>

              {expandedCountry && (
                <View className="mt-3">
                  <ThemedText>اختار الدولة</ThemedText>
                  <SelectList
                    data={countries}
                    setSelected={(value: string) => {
                      setSelectedCountry(value);
                      setSelectedCity(null);
                    }}
                    search={false}
                    dropdownTextStyles={{ color: textColor }}
                    inputStyles={{ color: textColor }}
                  />
                </View>
              )}

              {selectedCountry && (
                <View className={`mt-3 mb-3`}>
                  <ThemedText>اختار المدينة</ThemedText>
                  <SelectList
                    data={cityNames}
                    setSelected={(value: string) => setSelectedCity(value)}
                    search={false}
                    dropdownTextStyles={{ color: textColor }}
                    inputStyles={{ color: textColor }}
                  />
                </View>
              )}
            </View>
          </ScrollView>

          <View className="flex-row items-center mt-auto">
            <TouchableOpacity
              className={`border border-dark/40 ${
                !isReady ? "opacity-60" : "opacity-100"
              } rounded-2xl py-2 flex-1`}
              disabled={!isReady}
              onPress={locationManualDetect}
              style={{ backgroundColor: bg }}
            >
              <ThemedText className="text-lg font-cairo-bold text-center">
                التالي
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-2xl py-2 flex-1"
              onPress={router.back}
            >
              <ThemedText className="text-lg font-cairo-bold text-center">
                الرجوع
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BgWrapper>
  );
};

export default AccessLocation;
