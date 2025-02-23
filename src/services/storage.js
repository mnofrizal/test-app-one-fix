import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
  NOTIFICATIONS: "notifications",
};

export const setToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  } catch (error) {
    console.error("Error storing token:", error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("Error removing token:", error);
  }
};

export const setUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user:", error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error("Error removing user:", error);
  }
};

export const clearStorage = async () => {
  try {
    // Clear all keys in AsyncStorage
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing storage:", error);
  }
};

// Notification Storage Methods
export const getStoredNotifications = async () => {
  try {
    const notifications = await AsyncStorage.getItem(
      STORAGE_KEYS.NOTIFICATIONS
    );
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
};

export const storeNotifications = async (notifications) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.NOTIFICATIONS,
      JSON.stringify(notifications)
    );
  } catch (error) {
    console.error("Error storing notifications:", error);
  }
};

export const addNotificationToStorage = async (notification) => {
  try {
    const currentNotifications = await getStoredNotifications();
    const updatedNotifications = [notification, ...currentNotifications];
    await storeNotifications(updatedNotifications);
    return updatedNotifications;
  } catch (error) {
    console.error("Error adding notification:", error);
    return [];
  }
};

export const updateNotificationInStorage = async (notificationId, updates) => {
  try {
    const notifications = await getStoredNotifications();
    const updatedNotifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, ...updates } : n
    );
    await storeNotifications(updatedNotifications);
    return updatedNotifications;
  } catch (error) {
    console.error("Error updating notification:", error);
    return [];
  }
};
