import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";
import { CONFIG } from "./config";

const os = Platform.OS;

export const fetchAdhanSound = async (filename: string) => {
  try {
    const extension = os === "android" ? "ogg" : "wav";

    const soundDir = new Directory(Paths.document, "soundDir");
    if (!soundDir.exists) {
      soundDir.create();
    }

    const localFile = new File(soundDir, `${filename}.${extension}`);
    if (!localFile.exists) {
      const downloadedSound = await File.downloadFileAsync(
        `${CONFIG.ADHAN_SOUND_URL}/${filename}.${extension}`,
        localFile
      );

      console.log(`downloaded sound for : ${filename}.${extension}`);

      return downloadedSound.uri;
    }

    return localFile.uri;
  } catch (e) {
    console.error(e);
    return null;
  }
};
