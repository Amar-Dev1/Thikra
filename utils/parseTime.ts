export const convert24To12 = (time24?: string | null) => {
  if (!time24 || typeof time24 !== "string") return "N/A";
  const parts = time24.split(":");
  if (parts.length < 2) return "N/A";

  const [hPart, mPart] = parts;
  const hoursNum = parseInt(hPart, 10);
  const minutesNum = parseInt(mPart, 10);

  if (Number.isNaN(hoursNum) || Number.isNaN(minutesNum)) return "N/A";

  const period = hoursNum >= 12 ? "pm" : "am";
  const hours12 = hoursNum % 12 || 12;
  const minutesStr = minutesNum < 10 ? `0${minutesNum}` : `${minutesNum}`;

  return `${hours12}:${minutesStr} ${period}`;
};

export const convertToHHMM = (time: string) => {
  const [hourStr, minutesStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minutesStr, 10);
  return { hour, minute };
};
