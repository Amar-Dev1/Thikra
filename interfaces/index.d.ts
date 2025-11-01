import React from "react";
import { SvgProps } from "react-native-svg";

export interface ILocation {
  city: string | null;
  country: string | null;
}

export interface IPrayerDetails {
  key: number;
  name: string;
  enName: string;
  time: string;
  to: string;
}

export interface IGreatName {
  id?: number;
  name: string;
  text?: string;
  className?: string;
  onPress?: () => void;
}

export interface IDuaCategory {
  id?: any;
  title: string;
  Icon: React.FC<SvgProps>;
  className?: string;
}

export interface IDuaCategoryItem {
  id?: any;
  name: string;
  className?: string;
  categoryId: number;
}

// saved screen consist of categories (Quran,Dua,...etc)
export interface ISavedCategory {
  id?: any;
  name: "القرآن" | "الأدعية و الأذكار";
  items: ISavedCategoryItem[];
}

// category item
export interface ISavedCategoryItem {
  id?: any;
  route?: string;
  name?: string;
}

// export interface ISurah {
//   id: number;
//   name: string;
//   from: number;
//   to: number;
//   audio?: string;
// }
