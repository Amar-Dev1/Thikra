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

export interface ISurah {
  id: number;
  name: string;
  from: number;
  to: number;
  audio?: string;
}
