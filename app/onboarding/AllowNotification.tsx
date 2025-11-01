import BgWrapper from "@/components/BgWrapper";
import { images } from "@/constants/images";
import { accessNotifications } from "@/utils/accessNotifications";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

const AllowNotification = () => {
  const handleAllow = async () => {
    try {
      const allowed = await accessNotifications();
      if (!allowed) return;
      else router.push("/onboarding/AccessLocation");
    } catch (e) {
      console.warn(e);
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