import { Animated, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const KitchenOrderCard = ({ order, onPress, style }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_KITCHEN":
        return {
          bg: "bg-blue-500",
          text: "text-white",
          icon: "clock-outline",
          pillText: "bg-blue-50 text-blue-700",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-yellow-500",
          text: "text-white",
          icon: "progress-clock",
          pillText: "bg-yellow-50 text-yellow-700",
        };
      case "COMPLETED":
        return {
          bg: "bg-green-500",
          text: "text-white",
          icon: "check-circle",
          pillText: "bg-green-50 text-green-700",
        };
      case "CANCELED":
        return {
          bg: "bg-red-500",
          text: "text-white",
          icon: "close-circle",
          pillText: "bg-red-50 text-red-700",
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-white",
          icon: "help-circle",
          pillText: "bg-gray-50 text-gray-700",
        };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING_KITCHEN":
        return "Menunggu";
      case "IN_PROGRESS":
        return "Diproses";
      case "COMPLETED":
        return "Selesai";
      case "CANCELED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  const totalItems = order.employeeOrders.reduce((total, employee) => {
    return (
      total + employee.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    );
  }, 0);

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    // For dates less than a day old, show relative time
    if (diffInSeconds < 86400) {
      // Less than a minute
      if (diffInSeconds < 60) {
        return "just now";
      }

      // Less than an hour
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} ${minutes === 1 ? "menit" : "menit"} lalu`;
      }

      // Less than a day
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "jam" : "jam"} lalu`;
    }

    // For older dates (more than 1 day), use formatted date/time
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const truncateText = (text, length = 30) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const status = getStatusColor(order.status);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        className="mb-4 overflow-hidden rounded-xl bg-white"
        onPress={() => onPress(order)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 2,
          boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)", // Added glow effect
        }}
      >
        {/* Content */}
        <View className="p-4">
          {/* Order ID and Title */}
          <View className="mb-3 border-b border-slate-100 pb-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="">
                  <Text className="text-sm font-medium text-gray-600">
                    #{order.id || "-"}
                  </Text>
                </View>
                <View className="mx-2 h-4 w-[1px] rotate-12 bg-gray-300" />
                <View className="">
                  <Text className="text-sm font-medium text-gray-600">
                    {order.category || "-"}
                  </Text>
                </View>
                <View className="mx-2 h-4 w-[1px] rotate-12 bg-gray-300" />
                <View className="">
                  <Text className="text-sm font-medium text-gray-600">
                    {totalItems} Porsi
                  </Text>
                </View>
              </View>
              <View className={`rounded-md px-3 py-1 ${status.bg}`}>
                <Text className="text-xs font-medium text-white">
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>
            <Text className="mt-2 text-base text-gray-900">
              {order.judulPekerjaan}
            </Text>
          </View>

          {/* Order Details */}
          <View className="flex-row justify-between">
            <View className="flex-1">
              {/* Location */}
              <View className="mb-1 flex-row items-center">
                <View className="rounded-full">
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={14}
                    color="#2563EB"
                  />
                </View>
                <Text className="ml-2 text-xs text-gray-600">
                  {order.dropPoint || "-"}
                </Text>
              </View>

              {/* PIC */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="rounded-full">
                    <MaterialCommunityIcons
                      name="account"
                      size={14}
                      color="#7C3AED"
                    />
                  </View>
                  <Text className="ml-2 text-xs text-gray-600">
                    {order.supervisor?.subBidang || "-"}
                  </Text>
                </View>
                <View>
                  <Text className={`ml-1 text-xs text-gray-600`}>
                    {formatRelativeDate(order.requestDate)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default KitchenOrderCard;
