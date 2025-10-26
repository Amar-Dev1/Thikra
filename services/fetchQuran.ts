import { Directory, File, Paths } from "expo-file-system";
import { CONFIG } from "./config";

export const fetchAllQuran = async () => {
  await fetchQuranPart(1, 200);
  await fetchQuranPart(201, 402);
  await fetchQuranPart(403, 604);
};

export const fetchQuranPart = async (
  start: number,
  end: number,
  onProgress?: (percentage: number) => void
) => {
  const quranDir = new Directory(Paths.document, "quran");
  if (!quranDir.exists) {
    quranDir.create();
  }

  const total = end - start + 1;
  let completed = 0;

  for (let i = start; i <= end; i++) {
    const repo = i <= 200 ? "qp" : i <= 402 ? "qp2" : "qp3";
    const remoteUrl = `${CONFIG.ALL_QURAN_URL}/${repo}/main/${i}.png`;
    // @ts-ignore
    const localFile = new File(quranDir, `${i}.png`);
    const exists = localFile.exists;
    if (!exists) {
      try {
        const downloaded = await File.downloadFileAsync(remoteUrl, localFile);
        console.log(`Downloaded page ${i} to :`, downloaded.uri);
      } catch (e) {
        console.error(`faild to download page ${i}`, e);
        throw e;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
    } else {
      continue;
    }
    completed++;
    const percentage = (completed / total) * 100;
    onProgress && onProgress(percentage);
  }
};

export const fetchSurahAudio = async (surahNumber: number) => {
  try {
    const quranAudio = new Directory(Paths.document, "quranAudio");
    if (!quranAudio.exists) {
      quranAudio.create();
    }
    const localFile = new File(quranAudio, `${surahNumber}.mp3`);
    if (!localFile.exists) {
      const downloadedAudio = await File.downloadFileAsync(
        `${CONFIG.SURAH_AUDIO_URL}/${surahNumber}.mp3`,
        localFile
      );
      console.log(
        `Downloaded audio for surah no. ${surahNumber}, ${downloadedAudio.uri}`
      );
      return downloadedAudio.uri;
    }
    return localFile.uri;
  } catch (e) {
    console.error(e);
    return null;
  }
};
