import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import api from "./interceptors";

export const getExpoPushToken = async () => {
  if (!Device.isDevice) {
    console.log("Must use physical device for Push Notifications");
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // If no existing permission, request it
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // If permission not granted, return null
  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return null;
  }

  // Get Expo push token
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "94126c87-57fc-413d-b0ea-84539bc62809",
    })
  ).data;

  // Configure notification handling for Android
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

export const registerPushToken = async (token) => {
  if (!token) return false;

  try {
    await api.post("/push-tokens", {
      token,
      device: Device.modelName || "Unknown Device",
      isActive: true,
    });
    return true;
  } catch (error) {
    console.error("Error registering push token:", error);
    return false;
  }
};

export const addNotificationResponseListener = (callback) => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

export const addNotificationReceivedListener = (callback) => {
  return Notifications.addNotificationReceivedListener(callback);
};

export const removePushToken = async (token) => {
  try {
    await api.delete(`/push-tokens/token/${token}`);
    return true;
  } catch (error) {
    console.error("Error removing push token:", error);
    return false;
  }
};

export const updatePushToken = async (token, isActive = true) => {
  try {
    await api.put(`/push-tokens/${token}`, {
      isActive,
      device: Device.modelName || "Unknown Device",
    });
    return true;
  } catch (error) {
    console.error("Error updating push token:", error);
    return false;
  }
};
