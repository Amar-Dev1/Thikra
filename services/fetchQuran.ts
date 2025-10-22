import { Directory, Paths } from "expo-file-system";
// import { CONFIG } from "./config";

export const fetchPerPage = async () => {};

export const fetchAllQuran = async () => {};

export const fetchQuranPart = async (start: number, end: number) => {
  const quranDir = new Directory(Paths.document, "thikraQuran");
  quranDir.create();


  // for (let i = start; i <= end; i++) {
  //   const repo = i <= 200 ? "qp" : i <= 402 ? "qp2" : "qp3";
  //   const remoteUrl = `${CONFIG.ALL_QURAN_URL}/${repo}/main/${i}.png`;
  //   const file = new File(Paths.di)
  // }
};
