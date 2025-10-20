export const convert24To12 = (time24: string) => {
  let [hours, minutes] = time24.split(":").map(Number);

  let period: string;
  if (hours >= 12) {
    period = "PM";
  } else {
    period = "AM";
  }

  hours = hours % 12 || 12;

  if (minutes < 10) {
    // @ts-ignore
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes} ${period}`;
};
