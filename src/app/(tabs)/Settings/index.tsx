import BgWrapper from "@/src/components/BgWrapper";
import ThemedText from "@/src/components/ThemedText";
import { Colors } from "@/src/constants/colors";
import {
  BellSvg,
  ContactSvg,
  InfoSvg,
  RefreshSvg,
  RightAngleSvg,
  ShareSvg,
  ThemeSvg,
} from "@/src/constants/icons";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { requestPermission } from "@/src/utils/Notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as updates from "expo-updates";
import React, { useState } from "react";
import {
  Dimensions,
  I18nManager,
  Linking,
  ScrollView,
  Share,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";

const { width, height } = Dimensions.get("window");

const Settings = () => {
  const router = useRouter();
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // @ts-ignore
  const { currentTheme, changeTheme } = useTheme();
  const isDark = currentTheme === "dark";

  const bg = isDark ? "#222222" : "#F8EFD4";
  const textColor = isDark ? "#E0E0E0" : "#222222";
  const cardBg = isDark ? "#1A1A1A" : "#F9F8F3";
  const mutedText = isDark ? "#999" : "#666";

  const handleThemeChange = async (theme: string) => {
    setThemeModalVisible(false);
    await changeTheme(theme);
  };

  const handleLanguageChange = async (lang: string) => {
    if (i18n.locale === lang) return;

    await AsyncStorage.setItem("userLanguage", lang);
    const isRTL = lang === "ar";

    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }

    // Reload app to apply language and RTL changes
    setTimeout(async () => {
      await updates.reloadAsync();
    }, 100);
  };

  const handleNotificationPermission = async () => {
    const allowed = await requestPermission();
    if (!allowed) return;
    setNotificationsEnabled(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          i18n.t("screens.settings.share_app_desc") + "\nhttps://thikra.app",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const SettingItem = ({
    Icon,
    title,
    desc,
    rightElement,
    onPress,
    showArrow = false,
  }: any) => (
    <TouchableOpacity
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      className={`flex-row items-center px-4 py-5 ${
        !rightElement && !showArrow ? "" : ""
      }`}
      style={{
        borderBottomWidth: 0.5,
        borderBottomColor: isDark ? "#333" : "#EEE",
      }}
    >
      <View
        className={`w-10 h-10 items-center justify-center rounded-full ${
          isDark ? "bg-[#222]" : "bg-[#F0EEE6]"
        }`}
      >
        <Icon
          width={22}
          height={22}
          stroke={isDark ? Colors.brandGold : Colors.brandBrown}
        />
      </View>
      <View className="flex-1 ml-3 mr-2">
        <ThemedText
          className="text-[17px] font-cairo-bold leading-tight"
          style={{ color: textColor }}
        >
          {title}
        </ThemedText>
        {desc && (
          <ThemedText
            className="text-[13px] font-cairo leading-tight mt-0.5"
            style={{ color: mutedText }}
          >
            {desc}
          </ThemedText>
        )}
      </View>
      {rightElement}
      {showArrow && <RightAngleSvg width={16} height={16} stroke={mutedText} />}
    </TouchableOpacity>
  );

  return (
    <BgWrapper className="flex-1">
      {/* Header */}
      <View className="items-center pt-12 pb-4">
        <Text
          className="text-2xl font-cairo-bold"
          style={{ color: Colors.brandBrown }}
        >
          {i18n.t("screens.settings.title")}
        </Text>
      </View>

      <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
        {/* Preferences Section */}
        <View className="mt-6 mb-8">
          <Text
            className="text-[14px] font-cairo-bold tracking-widest uppercase mb-1"
            style={{ color: mutedText }}
          >
            {i18n.t("screens.settings.preferences_header")}
          </Text>
          <View className="h-1.5 w-14 bg-[#F5C97B] rounded-full mt-1" />
        </View>

        {/* General Section */}
        <View className="mb-8">
          <Text
            className="text-[14px] font-cairo-bold tracking-widest uppercase mb-3 ml-2"
            style={{ color: mutedText }}
          >
            {i18n.t("screens.settings.general_header")}
          </Text>
          <View
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: cardBg }}
          >
            {/* Language */}
            <SettingItem
              Icon={RefreshSvg}
              title={i18n.t("screens.settings.language_title")}
              desc={i18n.t("screens.settings.language_desc")}
              rightElement={
                <View className="flex-row bg-[#EBE9E0] rounded-full p-1 w-32 border border-[#DDD]">
                  <TouchableOpacity
                    onPress={() => handleLanguageChange("en")}
                    className={`flex-1 items-center justify-center py-1.5 rounded-full ${
                      i18n.locale === "en" ? "bg-[#F5C97B]" : ""
                    }`}
                  >
                    <Text
                      className={`text-[12px] font-cairo-bold ${
                        i18n.locale === "en" ? "text-black" : "text-gray-500"
                      }`}
                    >
                      English
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleLanguageChange("ar")}
                    className={`flex-1 items-center justify-center py-1.5 rounded-full ${
                      i18n.locale === "ar" ? "bg-[#F5C97B]" : ""
                    }`}
                  >
                    <Text
                      className={`text-[12px] font-cairo-bold ${
                        i18n.locale === "ar" ? "text-black" : "text-gray-500"
                      }`}
                    >
                      عربي
                    </Text>
                  </TouchableOpacity>
                </View>
              }
            />
            {/* Notifications */}
            <SettingItem
              Icon={BellSvg}
              title={i18n.t("screens.settings.notifications_title")}
              desc={i18n.t("screens.settings.notifications_desc")}
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationPermission}
                  trackColor={{ false: "#D1D1D1", true: Colors.brandBrown }}
                  thumbColor="#FFF"
                />
              }
            />
            {/* Theme */}
            <SettingItem
              Icon={ThemeSvg}
              title={i18n.t("screens.settings.theme_title")}
              desc={i18n.t("screens.settings.theme_desc")}
              onPress={() => setThemeModalVisible(true)}
              showArrow={true}
            />
          </View>
        </View>

        {/* Support Section */}
        <View className="mb-10">
          <Text
            className="text-[14px] font-cairo-bold tracking-widest uppercase mb-3 ml-2"
            style={{ color: mutedText }}
          >
            {i18n.t("screens.settings.support_header")}
          </Text>
          <View
            className="rounded-3xl overflow-hidden"
            style={{ backgroundColor: cardBg }}
          >
            <SettingItem
              Icon={InfoSvg}
              title={i18n.t("screens.settings.about_thikra")}
              showArrow={true}
              onPress={() => router.push("/Settings/About")}
            />
            <SettingItem
              Icon={ContactSvg}
              title={i18n.t("screens.settings.report_problem")}
              showArrow={true}
              onPress={() => Linking.openURL("mailto:Thikraapp@gmail.com")}
            />
            <SettingItem
              Icon={ShareSvg}
              title={i18n.t("screens.settings.share_app")}
              showArrow={true}
              onPress={handleShare}
            />
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mb-10 opacity-40">
          <Text
            className="text-[10px] font-cairo-bold tracking-[3px] uppercase"
            style={{ color: textColor }}
          >
            {i18n.t("screens.settings.version")} V2.5.0
          </Text>
          <Text
            className="text-[11px] font-cairo mt-1"
            style={{ color: textColor }}
          >
            {i18n.t("screens.settings.tagline")}
          </Text>
        </View>
      </ScrollView>

      {/* Theme Modal */}
      <Modal
        isVisible={themeModalVisible}
        onBackdropPress={() => setThemeModalVisible(false)}
        animationIn={"zoomIn"}
        animationOut={"zoomOut"}
        animationInTiming={400}
        animationOutTiming={400}
        backdropOpacity={0.5}
      >
        <View
          className={`p-6 rounded-3xl ${isDark ? "bg-[#1A1A1A]" : "bg-white"}`}
        >
          <View className="flex-row items-center justify-between mb-6">
            <ThemedText className="text-xl font-cairo-bold">
              {i18n.t("screens.settings.choose_theme")}
            </ThemedText>
            <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
              <Text className="text-gray-400 text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            <TouchableOpacity
              className="py-4 px-5 rounded-2xl flex-row items-center justify-between"
              style={{
                backgroundColor:
                  currentTheme === "light" ? Colors.brandGold : bg,
              }}
              onPress={() => handleThemeChange("light")}
            >
              <ThemedText
                className={
                  currentTheme === "light" ? "text-black font-cairo-bold" : ""
                }
              >
                {i18n.t("screens.settings.light_mode")}
              </ThemedText>
              {currentTheme === "light" && (
                <View className="w-2 h-2 rounded-full bg-black" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 px-5 rounded-2xl flex-row items-center justify-between"
              style={{
                backgroundColor:
                  currentTheme === "dark" ? Colors.brandGold : bg,
              }}
              onPress={() => handleThemeChange("dark")}
            >
              <ThemedText
                className={
                  currentTheme === "dark" ? "text-black font-cairo-bold" : ""
                }
              >
                {i18n.t("screens.settings.dark_mode")}
              </ThemedText>
              {currentTheme === "dark" && (
                <View className="w-2 h-2 rounded-full bg-black" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="py-4 px-5 rounded-2xl flex-row items-center justify-between"
              style={{
                backgroundColor:
                  currentTheme === "system" ? Colors.brandGold : bg,
              }}
              onPress={() => handleThemeChange("system")}
            >
              <ThemedText
                className={
                  currentTheme === "system" ? "text-black font-cairo-bold" : ""
                }
              >
                {i18n.t("screens.settings.system_default")}
              </ThemedText>
              {currentTheme === "system" && (
                <View className="w-2 h-2 rounded-full bg-black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </BgWrapper>
  );
};

export default Settings;
