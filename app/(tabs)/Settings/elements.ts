import { ISettingsElement } from "@/components/SettingsItem";
import { ContactSvg, InfoSvg, LocationSvg, ShareSvg, ThemeSvg } from "@/constants/icons";
import { Linking, Share } from "react-native";

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
  const recipient = "thikraapp@gmail.com";
  const subject = encodeURIComponent("technical report - Thikra");
  const body = encodeURIComponent(`Please describe the issue below:\n\n`);
  const mailToUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

  Linking.openURL(mailToUrl);
};


export const settingsElements: ISettingsElement[] = [
  {
    title: "الموقع",
    desc: "تعديل الموقع",
    route: "/Settings/EditLocation",
    Icon: LocationSvg,
  },
  {
    title: "السمات",
    desc: "تغيير لون التطبيق",
    Icon: ThemeSvg,
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
