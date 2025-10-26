import BgWrapper from "@/components/BgWrapper";
import { images } from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

const AllowNotification = () => {
  const handleAllow = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "لم يتم السماح",
          "لن نتمكن من إرسال التنبيهات لك إلا بعد السماح بالإشعارات."
        );
        
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        return;
      }

      await AsyncStorage.setItem("notifications_allowed", "true");
      router.push("/onboarding/AccessLocation");
    } catch (e) {
      console.error("Notification setup failed:", e);
      Alert.alert("حدث خطأ", "حدث خطأ أثناء إعداد الإشعارات.");
    }
  };

  const handleSkip = () => {
    router.push("/onboarding/AccessLocation");
  };

  return (
    <BgWrapper className="px-5">
      <View className="flex-row items-center gap-2">
        <Text className="font-cairo-bold text-3xl my-5">تفعيل الإشعارات</Text>
        <Image source={images.bell} className="size-10" />
      </View>
      <Text className="font-cairo text-xl opacity-65">
        الرجاء تفعيل اللإشعارات ، لكي تصلك مواقيت الصلاة ، و باقي الأذكار
      </Text>

      <View className="flex-row items-center mt-auto">
        <TouchableOpacity
          className="bg-primary rounded-2xl py-2 flex-1 shadow-md"
          onPress={handleAllow}
        >
          <Text className="text-lg font-cairo-bold text-center">سماح</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-2xl py-2 flex-1"
          onPress={handleSkip}
        >
          <Text className="text-lg font-cairo-bold text-center">تخطي</Text>
        </TouchableOpacity>
      </View>
    </BgWrapper>
  );
};

export default AllowNotification;
