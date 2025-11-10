import BgWrapper from "@/components/BgWrapper";
import ThemedText from "@/components/ThemedText";
import { images } from "@/constants/images";
import { useTheme } from "@/context/ThemeContext";
import { accessNotifications } from "@/utils/accessNotifications";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AllowNotification = () => {
  const insets = useSafeAreaInsets();

  // @ts-ignore
  const { currentTheme } = useTheme();
  const bg = currentTheme === "dark" ? "#222222" : "#F8EFD4";
  const textColor = currentTheme === "dark" ? "#ffffff" : "#222222";

  const [loading, setLoading] = useState(false);

  const handleAllow = async () => {
    try {
      setLoading(true);
      const allowed = await accessNotifications();
      if (!allowed) return;
      else router.push("/onboarding/AccessLocation");
    } catch (e) {
      console.warn(e);
    }finally{
      setLoading(false)
    }
  };

  return (
    <BgWrapper className="px-5">
      {loading ? (
        <Modal
          visible={loading}
          transparent
          statusBarTranslucent
          animationType="fade"
        >
          <View
            className="flex-1 gap-5 justify-center items-center"
            style={{ backgroundColor: bg, paddingBottom: insets.bottom }}
          >
            <ActivityIndicator color={textColor} size={"large"} />
            <ThemedText className="font-cairo-bold text-lg opacity-65">
              يرجى الإنتظار
            </ThemedText>
          </View>
        </Modal>
      ) : (
        <>
          <View className="flex-row items-center gap-2">
            <ThemedText className="font-cairo-bold text-3xl my-5">
              تفعيل الإشعارات
            </ThemedText>
            <Image source={images.bell} className="size-10" />
          </View>
          <ThemedText className="font-cairo text-xl opacity-65">
            الرجاء تفعيل اللإشعارات ، لكي تصلك مواقيت الصلاة ، و باقي الأذكار
          </ThemedText>

          <View className="flex-row items-center mt-auto">
            <TouchableOpacity
              className={`rounded-2xl py-2 flex-1 border ${
                currentTheme === "dark" ? "border-light/10" : "borde-dark/10"
              }`}
              onPress={handleAllow}
              style={{ backgroundColor: bg }}
            >
              <ThemedText className="text-lg font-cairo-bold text-center">
                سماح
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BgWrapper>
  );
};

export default AllowNotification;
