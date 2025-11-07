import { Directory, File, Paths } from "expo-file-system";
import { CONFIG } from "./config";

export const fetchAdhanSound = async (platform: string) => {
  try {
    const extension = platform === "android" ? "ogg" : "m4a";

    const soundDir = new Directory(Paths.document, "AdhanSounds");
    if (!soundDir.exists) {
      soundDir.create();
    }

    const localFile = new File(soundDir, `AboJabber.${extension}`);
    if (!localFile.exists) {
      const downloadedSound = await File.downloadFileAsync(
        `${CONFIG.ADHAN_SOUND_URL}/AboJabber.${extension}`,
        localFile
      );

      console.log(`downloaded sound for : AboJabber.${extension}`);

      return downloadedSound.uri;
    }

    return localFile.uri;
  } catch (e) {
    console.error(e);
    return null;
  }
};
