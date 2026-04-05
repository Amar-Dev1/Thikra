import * as Notifications from "expo-notifications";

export const requestPermission = async () => {
  // // 1. Check existing status
  // const { status: existingStatus } = await Notifications.getPermissionsAsync();
  // let finalStatus = existingStatus;

  // // 2. If not granted, ask
  // if (existingStatus !== "granted") {
  //   const { status } = await Notifications.requestPermissionsAsync();
  //   finalStatus = status;
  // }

  // // 3. Handle the result
  // if (finalStatus === "granted") {
  //   console.log("notification permission granted!");
  //   return true;
  //   // This is where you'd usually call your function to get the token
  // } else {
  //   console.log("notification permission denied.");
  //   return false;
  // }
  return false;
};
