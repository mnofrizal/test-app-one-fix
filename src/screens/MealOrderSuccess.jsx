import React from "react";
import { View, Text, TouchableOpacity, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

const MealOrderSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderData } = route.params || {};

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const generateOrderSummary = () => {
    let summary = `🍽️ Order Makanan\n\n`;
    summary += `📋 ${orderData.judulPekerjaan}\n`;
    summary += `📅 ${formatDate(orderData.requestDate)}\n`;
    summary += `📍 ${orderData.dropPoint}\n\n`;

    summary += `👤 PIC: ${orderData.pic.name}\n`;
    summary += `📱 HP: ${orderData.pic.nomorHp || "-"}\n`;
    summary += `🏢 Departemen: ${orderData.supervisor.subBidang}\n`;
    summary += `👨‍💼 ASMAN: ${orderData.supervisor.name}\n\n`;

    // Group orders by entity
    const ordersByEntity = {};
    orderData.employeeOrders.forEach((order) => {
      if (!ordersByEntity[order.entity]) {
        ordersByEntity[order.entity] = [];
      }
      ordersByEntity[order.entity].push(order);
    });

    // Add orders to summary
    Object.entries(ordersByEntity).forEach(([entity, orders]) => {
      summary += `${entity} (${orders.length})\n`;
      orders.forEach((order) => {
        summary += `- ${order.employeeName}: ${
          order.items.map((item) => item.menuName).join(", ") || "Unknown Menu"
        }\n`;
      });
      summary += "\n";
    });

    return summary;
  };

  const handleShare = async () => {
    try {
      const summary = generateOrderSummary();
      await Share.share({
        message: summary,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {/* Success Icon */}
        <View className="items-center py-12">
          <View className="rounded-full bg-green-100 p-4">
            <MaterialCommunityIcons
              name="check-circle"
              size={64}
              color="#22C55E"
            />
          </View>
          <Text className="mt-6 text-2xl font-bold text-gray-900">
            Order Submitted!
          </Text>
          <Text className="mt-2 text-center text-base text-gray-600">
            Your order has been successfully submitted and will be processed
            shortly.
          </Text>
        </View>

        {/* Order Summary */}
        <View className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Order Summary
          </Text>

          {/* Basic Info */}
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Order ID</Text>
              <Text className="font-medium text-gray-900">
                #{orderData.id || "N/A"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Date</Text>
              <Text className="font-medium text-gray-900">
                {formatDate(orderData.requestDate)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Drop Point</Text>
              <Text className="font-medium text-gray-900">
                {orderData.dropPoint}
              </Text>
            </View>
          </View>

          <View className="my-4 border-t border-gray-200" />

          {/* PIC Info */}
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">PIC</Text>
              <Text className="font-medium text-gray-900">
                {orderData.pic.name}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Department</Text>
              <Text className="font-medium text-gray-900">
                {orderData.supervisor.subBidang}
              </Text>
            </View>
          </View>

          <View className="my-4 border-t border-gray-200" />

          {/* Order Count */}
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Total Orders</Text>
            <Text className="font-medium text-gray-900">
              {orderData.employeeOrders.length} items
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View className="border-t border-gray-100 bg-white p-6 py-5">
        <View className="space-y-4">
          <TouchableOpacity
            onPress={handleShare}
            className="flex-row items-center justify-center rounded-xl border border-blue-600 py-4"
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color="#2563EB"
            />
            <Text className="ml-2 font-semibold text-blue-600">
              Share Order
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("MainTabs")}
            className="flex-row items-center justify-center rounded-xl bg-blue-600 py-4"
          >
            <MaterialCommunityIcons name="home" size={20} color="#FFFFFF" />
            <Text className="ml-2 font-semibold text-white">Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MealOrderSuccess;
