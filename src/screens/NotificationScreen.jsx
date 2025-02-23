import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import useNotificationStore from "../store/notificationStore";

const NotificationCard = ({ notification, onPress, onDelete }) => {
  const { id, type, title, body, timestamp, read } = notification;

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "order":
      case "kitchen_order":
        return "package-variant";
      case "reminder":
        return "bell";
      case "update":
        return "information";
      case "alert":
        return "alert-circle";
      default:
        return "bell";
    }
  };

  const getIconColor = (type) => {
    switch (type?.toLowerCase()) {
      case "order":
      case "kitchen_order":
        return "#4F46E5"; // indigo-600
      case "reminder":
        return "#EA580C"; // orange-600
      case "update":
        return "#0891B2"; // cyan-600
      case "alert":
        return "#DC2626"; // red-600
      default:
        return "#4F46E5"; // indigo-600
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(notification)}
      className={`mb-3 overflow-hidden rounded-xl border bg-white shadow-sm ${
        read ? "border-slate-200" : "border-indigo-200"
      }`}
      activeOpacity={0.7}
    >
      <View className={`px-4 py-3 ${read ? "" : "bg-indigo-50/30"}`}>
        <View className="flex-row items-center">
          <View
            className={`mr-3 rounded-lg p-2 ${
              read ? "bg-slate-50" : "bg-indigo-50"
            }`}
          >
            <MaterialCommunityIcons
              name={getIcon(type)}
              size={22}
              color={getIconColor(type)}
            />
          </View>
          <View className="flex-1 flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center justify-between">
                <Text
                  className={`text-sm ${
                    read ? "font-medium" : "font-semibold"
                  } text-gray-900`}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                <Text className="ml-2 text-xs font-medium text-slate-500">
                  {formatTimestamp(timestamp)}
                </Text>
              </View>
              <Text className="mt-0.5 text-sm text-slate-600" numberOfLines={2}>
                {body}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onDelete(id)}
              className="ml-1 rounded-full p-2"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons name="close" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NotificationSection = ({
  title,
  notifications,
  onNotificationPress,
  onDeletePress,
}) => (
  <View className="mb-6">
    <Text className="mb-3 text-lg font-bold tracking-tight text-gray-900">
      {title}
    </Text>
    {notifications.map((notification) => (
      <NotificationCard
        key={notification.id}
        notification={notification}
        onPress={onNotificationPress}
        onDelete={onDeletePress}
      />
    ))}
  </View>
);

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    }
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const groupNotificationsByDate = (notifications) => {
  const today = new Date().setHours(0, 0, 0, 0);
  const yesterday = today - 86400000; // 24 hours in milliseconds

  return notifications.reduce(
    (groups, notification) => {
      const date = new Date(notification.timestamp).setHours(0, 0, 0, 0);

      if (date === today) {
        return {
          ...groups,
          today: [...(groups.today || []), notification],
        };
      } else if (date === yesterday) {
        return {
          ...groups,
          yesterday: [...(groups.yesterday || []), notification],
        };
      } else {
        return {
          ...groups,
          earlier: [...(groups.earlier || []), notification],
        };
      }
    },
    { today: [], yesterday: [], earlier: [] }
  );
};

const NotificationScreen = () => {
  const {
    notifications,
    initializeNotifications,
    markAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotificationStore();

  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      await initializeNotifications();
      setLoading(false);
    };
    loadNotifications();
  }, [initializeNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await initializeNotifications();
    setRefreshing(false);
  }, [initializeNotifications]);

  const handleNotificationPress = useCallback(
    async (notification) => {
      await markAsRead(notification.id);

      // Navigate based on notification type
      if (notification.type?.toLowerCase().includes("kitchen")) {
        navigation.navigate("KitchenOrderDetail", {
          orderId: notification.data?.orderId,
        });
      } else if (notification.data?.orderId) {
        navigation.navigate("OrderDetail", {
          orderId: notification.data.orderId,
        });
      }
    },
    [markAsRead, navigation]
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <View className="flex-1 bg-slate-50">
      <View className="bg-white px-4 pb-4 pt-12 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-2xl font-bold tracking-tight text-gray-900">
              Notifications
            </Text>
            <Text className="text-sm font-medium text-slate-500">
              Stay updated with your requests
            </Text>
          </View>
          {notifications.length > 0 && (
            <TouchableOpacity
              className="rounded-lg bg-red-50 px-3 py-2"
              onPress={() => {
                Alert.alert(
                  "Clear All Notifications",
                  "Are you sure you want to clear all notifications? This cannot be undone.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Clear All",
                      style: "destructive",
                      onPress: clearNotifications,
                    },
                  ]
                );
              }}
            >
              <Text className="font-medium text-red-600">Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4F46E5"]}
            tintColor="#4F46E5"
          />
        }
      >
        <View className="p-4">
          {notifications.length > 0 ? (
            <>
              {groupedNotifications.today.length > 0 && (
                <NotificationSection
                  title="Today"
                  notifications={groupedNotifications.today}
                  onNotificationPress={handleNotificationPress}
                  onDeletePress={deleteNotification}
                />
              )}
              {groupedNotifications.yesterday.length > 0 && (
                <NotificationSection
                  title="Yesterday"
                  notifications={groupedNotifications.yesterday}
                  onNotificationPress={handleNotificationPress}
                  onDeletePress={deleteNotification}
                />
              )}
              {groupedNotifications.earlier.length > 0 && (
                <NotificationSection
                  title="Earlier"
                  notifications={groupedNotifications.earlier}
                  onNotificationPress={handleNotificationPress}
                  onDeletePress={deleteNotification}
                />
              )}
            </>
          ) : (
            <View className="mt-6 items-center">
              <MaterialCommunityIcons
                name="bell-off-outline"
                size={48}
                color="#9CA3AF"
              />
              <Text className="mt-4 text-base text-gray-500">
                No notifications yet
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default NotificationScreen;
