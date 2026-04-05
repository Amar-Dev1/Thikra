import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import { BellSvg } from "@/src/constants/icons";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { requestPermission } from "@/src/utils/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Modal, TouchableOpacity, View } from "react-native";
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
      const allowed = await requestPermission();
      if (!allowed) return;
      await AsyncStorage.setItem("notification_permission", "true");
      router.push("/onboarding/SetupAll");
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
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
              {i18n.t("common.wait")}
            </ThemedText>
          </View>
        </Modal>
      ) : (
        <>
          <View className="flex-row items-center gap-2">
            <ThemedText className="font-cairo-bold text-3xl my-5">
              {i18n.t("common.notification_permission_title")}
            </ThemedText>
            <BellSvg width={30} height={30} stroke={textColor} />
          </View>
          <ThemedText className="font-cairo text-xl opacity-65">
            {i18n.t("common.notification_permission_desc")}
          </ThemedText>

          <View className="flex-row items-center mt-auto">
            <TouchableOpacity
              className={`rounded-2xl py-2 flex-1 border ${
                currentTheme === "dark" ? "border-light/10" : "border-dark/50"
              }`}
              onPress={handleAllow}
              style={{ backgroundColor: bg }}
            >
              <ThemedText className="text-lg font-cairo-bold text-center">
                {i18n.t("common.allow")}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BgWrapper>
  );
};

export default AllowNotification;
