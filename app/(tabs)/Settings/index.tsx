import BgWrapper from "@/components/BgWrapper";
import MainTitle from "@/components/MainTitle";
import SettingsItem, { ISettingsElement } from "@/components/SettingsItem";
import {
  BellSvg,
  ContactSvg,
  InfoSvg,
  LocationSvg,
  ShareSvg,
} from "@/constants/icons";
import { images } from "@/constants/images";
import React from "react";
import {
  ImageBackground,
  Linking,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";

const onShare = async () => {
  try {
    await Share.share({
      message:
        "Check out Thikra app !,  Download it here:\nhttps://github.com/amar-dev1",
    });
  } catch (e) {
    console.log("faild to share app", e);
  }
};

const onReport = () => {
  const recipient = "amarofficial249@gmail.com";
  const subject = encodeURIComponent("technical report - Thikra");
  const body = encodeURIComponent(`
  Please describe the issue below:\n\n
  `);
  const mailToUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

  Linking.openURL(mailToUrl);
};

const elements: ISettingsElement[] = [
  {
    title: "الموقع",
    desc: "تعديل الموقع",
    route: "/Settings/EditLocation",
    Icon: LocationSvg,
  },
  {
    title: "إشعاراتي",
    desc: "تفضيلات الإشعارات",
    route: "/Settings/MyNotifications",
    Icon: BellSvg,
  },
  {
    title: "مشاركة التطبيق",
    desc: " كن شريكاً في الأجر",
    Icon: ShareSvg,
    onPress: async () => onShare(),
  },
  {
    title: "التبليغ عن مشاكل في التطبيق",
    desc: "تواصل مع المطور",
    Icon: ContactSvg,
    onPress: () => onReport(),
  },
  {
    title: "حول التطبيق",
    desc: "نبذة عن التطبيق",
    route: "/Settings/About",
    Icon: InfoSvg,
  },
];

const index = () => {
  return (
    <BgWrapper className="px-5 gap-3 bg-bgColor" hideBackground={true}>
      <View className="relative flex-row items-center justify-center py-4 border-b-[.5px] border-b-dark/20">
        <MainTitle title="الإعدادات" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {elements.map((item, index) => (
          <SettingsItem
            key={index}
            {...item}
            //  className="bg-bgColor rounded-xl px-5 mb-1"
          />
        ))}
      </ScrollView>
      <ImageBackground
        source={images.settingsImg}
        resizeMode="cover"
        className="relative min-h-[28%] mb-16 rounded-2xl overflow-hidden flex-col justify-center px-5"
      >
        <View className="absolute inset-0 bg-black/70" />
        <Text className="text-light font-cairo-bold text-md text-center">
          وَابْتَغِ فِيمَا آتَاكَ اللَّهُ الدَّارَ الْآخِرَةَ ۖ وَلَا تَنسَ
          نَصِيبَكَ مِنَ الدُّنْيَا ۖ وَأَحْسِن كَمَا أَحْسَنَ اللَّهُ إِلَيْكَ
          ۖ وَلَا تَبْغِ الْفَسَادَ فِي الْأَرْضِ ۖ إِنَّ اللَّهَ لَا يُحِبُّ
          الْمُفْسِدِينَ
        </Text>
        <Text className="text-light font-cairo text-xs text-center mt-5">
          [القصص : ٧٧]
        </Text>
      </ImageBackground>
    </BgWrapper>
  );
};

export default index;
