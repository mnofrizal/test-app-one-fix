import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const OrderCard = ({ type, title, date, status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-yellow-50 text-yellow-700";
      case "processing":
        return "bg-indigo-50 text-indigo-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case "meal":
        return "food";
      case "transport":
        return "car";
      case "room":
        return "door";
      case "stationary":
        return "pencil";
      default:
        return "package";
    }
  };

  return (
    <TouchableOpacity className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <View className="border-b border-slate-100 p-5">
        <View className="mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="mr-3 rounded-xl bg-indigo-50 p-3">
              <MaterialCommunityIcons
                name={getIcon(type)}
                size={24}
                color="#4F46E5"
              />
            </View>
            <View>
              <Text className="text-lg font-semibold text-gray-900">
                {title}
              </Text>
              <Text className="text-sm font-medium text-slate-500">{date}</Text>
            </View>
          </View>
          <View className={`rounded-full px-4 py-2 ${getStatusColor(status)}`}>
            <Text className="text-sm font-bold">{status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const OrderSection = ({ title, orders }) => (
  <View className="mb-8">
    <Text className="mb-4 text-xl font-bold tracking-tight text-gray-900">
      {title}
    </Text>
    {orders.map((order, index) => (
      <OrderCard key={index} {...order} />
    ))}
  </View>
);

const OrderScreen = () => {
  // Mock data - replace with real data
  const activeOrders = [
    {
      type: "meal",
      title: "Lunch Order",
      date: "Today, 12:30 PM",
      status: "Processing",
    },
    {
      type: "transport",
      title: "Airport Transfer",
      date: "Tomorrow, 09:00 AM",
      status: "Pending",
    },
  ];

  const pastOrders = [
    {
      type: "meal",
      title: "Dinner Order",
      date: "Yesterday, 19:00 PM",
      status: "Completed",
    },
    {
      type: "room",
      title: "Meeting Room A",
      date: "Jan 12, 2024",
      status: "Completed",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="bg-white px-6 pb-8 pt-10 shadow-sm">
        <Text className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
          Orders
        </Text>
        <Text className="text-lg font-medium text-slate-500">
          Track your service requests
        </Text>
      </View>

      <View className="p-6">
        <OrderSection title="Active Orders" orders={activeOrders} />
        <OrderSection title="Past Orders" orders={pastOrders} />
      </View>
    </ScrollView>
  );
};

export default OrderScreen;
