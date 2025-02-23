import { create } from "zustand";
import * as Notifications from "expo-notifications";
import api from "../config/api";
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

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  // Actions
  handleNewNotification: (notification) => {
    const store = get();
    store.addNotification({
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
