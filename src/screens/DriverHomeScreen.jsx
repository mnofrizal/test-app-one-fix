import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

const DriverHomeScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Driver Panel</Text>
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
        <View className="rounded-2xl border-2 border-green-100 bg-green-50 p-4">
          <View className="mb-4 flex-row items-center">
            <MaterialCommunityIcons name="steering" size={24} color="#047857" />
            <Text className="ml-2 text-lg font-semibold text-green-900">
              Current Assignment
            </Text>
          </View>
          <View className="rounded-xl bg-white p-4">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-base font-medium text-gray-900">
                  Food Delivery
                </Text>
                <Text className="mt-1 text-sm text-gray-600">
                  10 orders - Building A
                </Text>
              </View>
              <View className="rounded-full bg-blue-100 px-3 py-1">
                <Text className="text-sm font-medium text-blue-800">
                  Active
                </Text>
              </View>
            </View>
            <TouchableOpacity className="mt-4 flex-row items-center justify-center rounded-lg bg-green-600 py-2">
              <MaterialCommunityIcons name="check" size={20} color="white" />
              <Text className="ml-2 font-medium text-white">
                Mark as Delivered
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 space-y-4">
          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Upcoming Deliveries
            </Text>
            <View className="mt-3 space-y-3">
              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="food"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text className="ml-2 font-medium text-gray-900">
                    Lunch Delivery
                  </Text>
                </View>
                <Text className="text-gray-600">12:00 PM</Text>
              </View>
              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="package-variant"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text className="ml-2 font-medium text-gray-900">
                    Package Pickup
                  </Text>
                </View>
                <Text className="text-gray-600">2:30 PM</Text>
              </View>
            </View>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Today's Stats
            </Text>
            <View className="mt-3 flex-row justify-between">
              <View className="flex-1 items-center rounded-lg bg-blue-50 p-3">
                <Text className="text-sm font-medium text-blue-600">
                  Deliveries
                </Text>
                <Text className="text-xl font-bold text-blue-900">8</Text>
              </View>
              <View className="mx-2" />
              <View className="flex-1 items-center rounded-lg bg-green-50 p-3">
                <Text className="text-sm font-medium text-green-600">
                  Completed
                </Text>
                <Text className="text-xl font-bold text-green-900">5</Text>
              </View>
              <View className="mx-2" />
              <View className="flex-1 items-center rounded-lg bg-yellow-50 p-3">
                <Text className="text-sm font-medium text-yellow-600">
                  Pending
                </Text>
                <Text className="text-xl font-bold text-yellow-900">3</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DriverHomeScreen;
