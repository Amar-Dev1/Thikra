// This utility is fixed (see Bug #2 below)
// const createScheduleDate = (
//   hour: number,
//   minutes: number,
//   minutesOffset: number = 0
// ) => {
//   const scheduledDate = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate(),
//     hour,
//     minutes + minutesOffset, // <-- This was the bug
//     0
//   );

//   // If this time is already in the past, schedule it for tomorrow
//   if (scheduledDate < now) {
//     scheduledDate.setDate(scheduledDate.getDate() + 1);
//   }
//   return scheduledDate;
// };

export const scheduleAdhkar = async () => {
  // Schedule Adhkar notifications using the fixed utility
  //   if (prayer.key === 2) {
  //     // Fajr
  //     const adhkarTime = createScheduleDate(hour, minute, 10); // 10 mins after Fajr
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: "أذكار الصباح يا مسلم",
  //         body: "لا تغفل عن أذكار الصباح رحمك الله",
  //         sound: "default",
  //       },
  //       // @ts-ignore
  //       trigger: {
  //         date: adhkarTime,
  //         repeats: false,
  //       },
  //     });
  //     console.log(`SUCCESS: Scheduled notification for adhkar alsabah`);
  //   }
  //   if (prayer.key === 4) {
  //     // Asr
  //     const adhkarTime = createScheduleDate(hour, minute, 10); // 10 mins after Asr
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: "أذكار المساء يا مسلم",
  //         body: "لا تغفل عن أذكار المساء رحمك الله",
  //         sound: "default",
  //       },
  //       // @ts-ignore
  //       trigger: {
  //         date: adhkarTime,
  //         repeats: false,
  //       },
  //     });
  //     console.log(`SUCCESS: Scheduled notification for adhkar almasa`);
  //   }
};
