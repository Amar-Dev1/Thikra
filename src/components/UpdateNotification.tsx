import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import { CONFIG } from '../services/config';
import ThemedText from './ThemedText';

interface UpdateInfo {
  hasUpdate: boolean;
  version: string;
  link: string;
  message: string;
}

export const UpdateNotification = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [updateType, setUpdateType] = useState<'ota' | 'hard' | null>(null);
  const [hardUpdateInfo, setHardUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkUpdates();
  }, []);

  const checkUpdates = async () => {
    try {
      // 1. Check for OTA Update via Expo Updates
      if (!__DEV__) {
        try {
          const otaUpdate = await Updates.checkForUpdateAsync();
          if (otaUpdate.isAvailable) {
            setUpdateType('ota');
            setIsVisible(true);
            return;
          }
        } catch (otaErr) {
          console.warn("OTA Check error:", otaErr);
        }
      }

      // 2. Check for Hard Update via thikraworker
      if (CONFIG.PLAY_STORE_STATUS_URL) {
        const response = await fetch(CONFIG.PLAY_STORE_STATUS_URL);
        const data = await response.json();
        
        // Use the version to determine if a hard update is needed in the NEW app
        if (data.version && data.url) {
          const currentVersion = Constants.expoConfig?.version || '1.0.0';
          if (data.version !== currentVersion) {
            setHardUpdateInfo({
              hasUpdate: true,
              version: data.version,
              link: data.url,
              message: data.message || "يرجى التحديث للحصول على أحدث الميزات والإصلاحات."
            });
            setUpdateType('hard');
            setIsVisible(true);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to check updates", e);
    }
  };

  const handleUpdate = async () => {
    if (updateType === 'ota') {
      try {
        setIsUpdating(true);
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } catch (e) {
        setIsUpdating(false);
        console.warn("Failed to fetch OTA update", e);
      }
    } else if (updateType === 'hard' && hardUpdateInfo?.link) {
      Linking.openURL(hardUpdateInfo.link);
    }
  };

  const closeModal = () => setIsVisible(false);

  return (
    <Modal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.6}
      useNativeDriver
      hideModalContentWhileAnimating
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
    >
      <View className="bg-white dark:bg-neutral-900 rounded-3xl p-6 items-center shadow-xl">
        <View className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full items-center justify-center mb-4">
          <Text className="text-3xl">🚀</Text>
        </View>

        <ThemedText className="font-cairo-bold text-2xl text-center mb-2">
          تحديث جديد متاح!
        </ThemedText>

        <ThemedText className="font-cairo-regular text-center text-lg text-gray-600 dark:text-gray-400 mb-6">
          {updateType === 'hard' 
            ? hardUpdateInfo?.message || "يرجى التحديث للحصول على أحدث الميزات والإصلاحات."
            : "يتوفر تحديث جديد للتطبيق. هل تريد تحديثه الآن؟"}
        </ThemedText>

        <View className="w-full">
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isUpdating}
            className="w-full bg-green-600 rounded-xl py-4 items-center flex-row justify-center mb-3 shadow-sm"
          >
            {isUpdating ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <ThemedText className="text-white font-cairo-bold text-lg">
                {updateType === 'hard' ? 'تحديث الآن' : 'تنزيل وتحديث'}
              </ThemedText>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={closeModal}
            disabled={isUpdating}
            className="w-full bg-gray-100 dark:bg-neutral-800 rounded-xl py-4 items-center"
          >
            <ThemedText className="font-cairo-bold text-lg text-gray-700 dark:text-gray-300">
              لاحقاً
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
