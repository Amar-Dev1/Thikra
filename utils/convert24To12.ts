export const convert24To12 = (time24?: string | null) => {
  // guard: missing or invalid input
  if (!time24 || typeof time24 !== "string") return "N/A";

  // accept "HH:MM" or "HH:MM:SS"
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