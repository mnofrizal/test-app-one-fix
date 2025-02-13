import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NotificationCard = ({ type, title, message, time, read }) => {
  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case "order":
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
    switch (type.toLowerCase()) {
      case "order":
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
      className={`mb-4 overflow-hidden rounded-2xl border bg-white shadow-sm ${
        read ? "border-slate-200" : "border-indigo-200"
      }`}
    >
      <View className={`p-5 ${read ? "" : "bg-indigo-50/30"}`}>
        <View className="mb-3 flex-row">
          <View
            className={`mr-4 rounded-xl p-3 ${
              read ? "bg-slate-50" : "bg-indigo-50"
            }`}
          >
            <MaterialCommunityIcons
              name={getIcon(type)}
              size={24}
              color={getIconColor(type)}
            />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text
                className={`text-base ${
                  read ? "font-medium" : "font-semibold"
                } text-gray-900`}
              >
                {title}
              </Text>
              <Text className="text-sm font-medium text-slate-500">{time}</Text>
            </View>
            <Text className="mt-1 text-sm text-slate-600">{message}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NotificationSection = ({ title, notifications }) => (
  <View className="mb-8">
    <Text className="mb-4 text-xl font-bold tracking-tight text-gray-900">
      {title}
    </Text>
    {notifications.map((notification, index) => (
      <NotificationCard key={index} {...notification} />
    ))}
  </View>
);

const NotificationScreen = () => {
  // Mock data - replace with real data
  const todayNotifications = [
    {
      type: "order",
      title: "Order Confirmed",
      message: "Your lunch order has been confirmed and is being prepared.",
      time: "2m ago",
      read: false,
    },
    {
      type: "reminder",
      title: "Meeting Room Booking",
      message: "Your meeting in Room A starts in 15 minutes.",
      time: "15m ago",
      read: false,
    },
  ];

  const earlierNotifications = [
    {
      type: "update",
      title: "System Update",
      message: "New features have been added to the service request system.",
      time: "2d ago",
      read: true,
    },
    {
      type: "alert",
      title: "Request Rejected",
      message: "Your transport request for tomorrow has been declined.",
      time: "3d ago",
      read: true,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="bg-white px-6 pb-8 pt-10 shadow-sm">
        <Text className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
          Notifications
        </Text>
        <Text className="text-lg font-medium text-slate-500">
          Stay updated with your requests
        </Text>
      </View>

      <View className="p-6">
        <NotificationSection title="Today" notifications={todayNotifications} />
        <NotificationSection
          title="Earlier"
          notifications={earlierNotifications}
        />
      </View>
    </ScrollView>
  );
};

export default NotificationScreen;
