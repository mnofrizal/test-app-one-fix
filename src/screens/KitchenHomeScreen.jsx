import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

const KitchenHomeScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            Kitchen Panel
          </Text>
          <Text className="text-base text-gray-600">Welcome, {user?.name}</Text>
        </View>
        <TouchableOpacity
          onPress={logout}
          className="rounded-full bg-gray-100 p-2"
        >
          <MaterialCommunityIcons name="logout" size={24} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-6">
        <View className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-4">
          <View className="mb-4 flex-row items-center">
            <MaterialCommunityIcons
              name="food-variant"
              size={24}
              color="#1E40AF"
            />
            <Text className="ml-2 text-lg font-semibold text-blue-900">
              Today's Orders
            </Text>
          </View>
          <Text className="text-base text-blue-700">
            Kitchen staff will see incoming food orders here
          </Text>
        </View>

        <View className="mt-6 space-y-4">
          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Pending Orders
            </Text>
            <Text className="text-base text-gray-600">
              Orders waiting to be prepared
            </Text>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              In Progress
            </Text>
            <Text className="text-base text-gray-600">
              Orders currently being prepared
            </Text>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Ready for Pickup
            </Text>
            <Text className="text-base text-gray-600">
              Orders ready for delivery
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KitchenHomeScreen;
