import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

const PoolHomeScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            Pool Manager Panel
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
        <View className="rounded-2xl border-2 border-indigo-100 bg-indigo-50 p-4">
          <View className="mb-4 flex-row items-center">
            <MaterialCommunityIcons
              name="car-multiple"
              size={24}
              color="#1E40AF"
            />
            <Text className="ml-2 text-lg font-semibold text-indigo-900">
              Vehicle Management
            </Text>
          </View>
          <Text className="text-base text-indigo-700">
            Manage vehicle requests and assignments
          </Text>
        </View>

        <View className="mt-6 space-y-4">
          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold text-gray-900">
                  Pending Requests
                </Text>
                <Text className="text-base text-gray-600">
                  New vehicle requests
                </Text>
              </View>
              <View className="rounded-full bg-yellow-100 px-3 py-1">
                <Text className="text-sm font-medium text-yellow-800">5</Text>
              </View>
            </View>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Available Vehicles
              </Text>
              <MaterialCommunityIcons
                name="car-info"
                size={24}
                color="#4F46E5"
              />
            </View>
            <View className="space-y-2">
              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <Text className="font-medium text-gray-900">Cars</Text>
                <Text className="text-gray-600">4 available</Text>
              </View>
              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <Text className="font-medium text-gray-900">Vans</Text>
                <Text className="text-gray-600">2 available</Text>
              </View>
            </View>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Active Trips
            </Text>
            <Text className="text-base text-gray-600">
              Currently ongoing vehicle assignments
            </Text>
            <View className="mt-3 flex-row items-center justify-between rounded-lg bg-blue-50 p-3">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="car-clock"
                  size={24}
                  color="#1E40AF"
                />
                <Text className="ml-2 font-medium text-blue-900">3 trips</Text>
              </View>
              <TouchableOpacity>
                <Text className="font-medium text-blue-600">View All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PoolHomeScreen;
