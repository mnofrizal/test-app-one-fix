import { create } from "zustand";
import * as Notifications from "expo-notifications";
import api from "../config/api";
import {
  getStoredNotifications,
  storeNotifications,
  addNotificationToStorage,
  updateNotificationInStorage,
} from "../services/storage";
import {
  NOTIFICATION_TYPES,
  getNotificationTitle,
} from "../constants/notificationTypes";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  expoPushToken: null,

  setExpoPushToken: (token) => {
    set({ expoPushToken: token });
  },

  // Initialize notifications from storage
  initializeNotifications: async () => {
    const storedNotifications = await getStoredNotifications();
    const unreadCount = storedNotifications.filter((n) => !n.read).length;
    set({ notifications: storedNotifications, unreadCount });
  },

  addNotification: async (notification) => {
    const updatedNotifications = await addNotificationToStorage(notification);
    set((state) => ({
      notifications: updatedNotifications,
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (notificationId) => {
    const updatedNotifications = await updateNotificationInStorage(
      notificationId,
      { read: true }
    );
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;
    set({ notifications: updatedNotifications, unreadCount });
  },

  markAllAsRead: async () => {
    const currentNotifications = await getStoredNotifications();
    const updatedNotifications = currentNotifications.map((n) => ({
      ...n,
      read: true,
    }));
    await storeNotifications(updatedNotifications);
    set({ notifications: updatedNotifications, unreadCount: 0 });
  },

  deleteNotification: async (notificationId) => {
    const currentNotifications = await getStoredNotifications();
    const updatedNotifications = currentNotifications.filter(
      (n) => n.id !== notificationId
    );
    await storeNotifications(updatedNotifications);
    set({
      notifications: updatedNotifications,
      unreadCount: updatedNotifications.filter((n) => !n.read).length,
    });
  },

  clearNotifications: async () => {
    await storeNotifications([]);
    set({ notifications: [], unreadCount: 0 });
  },

  // Actions
  handleNewNotification: async (notification) => {
    const store = get();
    await store.addNotification({
      id: notification.messageId || Date.now().toString(),
      title: notification.request.content.data?.type
        ? getNotificationTitle(notification.request.content.data.type)
        : notification.request.content.title,
      body: notification.request.content.body,
      data: notification.request.content.data,
      type: notification.request.content.data?.type,
      timestamp: notification.date || new Date(),
      read: false,
    });
  },

  sendNotification: async ({ userIds, notification }) => {
    try {
      await api.post("/notifications/send-to-users", {
        userIds,
        notification,
      });
      return { success: true };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { success: false, error };
    }
  },

  // For testing purposes
  scheduleLocalNotification: async ({
    title,
    body,
    data = {},
    seconds = 5,
  }) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger: { seconds },
      });
      return { success: true };
    } catch (error) {
      console.error("Error scheduling local notification:", error);
      return { success: false, error };
    }
  },
}));

export default useNotificationStore;
