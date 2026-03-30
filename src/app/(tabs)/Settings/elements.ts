import { ISettingsElement } from "@/src/components/SettingsItem";
import {
  ContactSvg,
  InfoSvg,
  LocationSvg,
  ShareSvg,
  ThemeSvg,
} from "@/src/constants/icons";
import i18n from "@/src/i18n";
import { Linking, Share } from "react-native";

const onShare = async () => {
  try {
    await Share.share({
      message:
        "Check out Thikra app !,  Download it here:\nhttps://thikra.netlify.app",
      url: "https://thikra.netlify.app",
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
    title: i18n.t("screens.location.title"),
    desc: i18n.t("screens.location.edit_title"),
    route: "/Settings/EditLocation",
    Icon: LocationSvg,
  },
  {
    title: i18n.t("screens.settings.theme_modal_title"),
    desc: i18n.t("screens.settings.theme_modal_desc"),
    Icon: ThemeSvg,
  },
  {
    title: i18n.t("screens.settings.share_app"),
    desc: i18n.t("screens.settings.share_app_desc"),
    Icon: ShareSvg,
    onPress: async () => onShare(),
  },
  {
    title: i18n.t("screens.settings.report_issue"),
    desc: i18n.t("screens.settings.contact_developer"),
    Icon: ContactSvg,
    onPress: () => onReport(),
  },
  {
    title: i18n.t("screens.settings.about_title"),
    desc: i18n.t("screens.settings.about_desc"),
    route: "/Settings/About",
    Icon: InfoSvg,
  },
];
