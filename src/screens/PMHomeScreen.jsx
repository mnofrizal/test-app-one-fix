import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

const PMHomeScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-gray-900">PM Panel</Text>
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
        <View className="rounded-2xl border-2 border-purple-100 bg-purple-50 p-4">
          <View className="mb-4 flex-row items-center">
            <MaterialCommunityIcons
              name="clipboard-check"
              size={24}
              color="#6D28D9"
            />
            <Text className="ml-2 text-lg font-semibold text-purple-900">
              Pending Approvals
            </Text>
          </View>
          <View className="space-y-3">
            <View className="rounded-xl bg-white p-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900">
                    Vehicle Request
                  </Text>
                  <Text className="mt-1 text-sm text-gray-600">
                    Department: Engineering
                  </Text>
                </View>
                <View className="rounded-full bg-yellow-100 px-3 py-1">
                  <Text className="text-sm font-medium text-yellow-800">
                    Urgent
                  </Text>
                </View>
              </View>
              <View className="mt-3 flex-row space-x-2">
                <TouchableOpacity className="flex-1 rounded-lg bg-green-600 py-2">
                  <Text className="text-center font-medium text-white">
                    Approve
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 rounded-lg bg-red-600 py-2">
                  <Text className="text-center font-medium text-white">
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-6 space-y-4">
          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Department Overview
            </Text>
            <View className="mt-3 space-y-3">
              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="account-group"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text className="ml-2 font-medium text-gray-900">
                    Engineering
                  </Text>
                </View>
                <View className="rounded-full bg-blue-100 px-3 py-1">
                  <Text className="text-sm text-blue-800">3 Requests</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="account-group"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text className="ml-2 font-medium text-gray-900">
                    Operations
                  </Text>
                </View>
                <View className="rounded-full bg-blue-100 px-3 py-1">
                  <Text className="text-sm text-blue-800">2 Requests</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Recent Activity
              </Text>
              <MaterialCommunityIcons
                name="history"
                size={24}
                color="#4F46E5"
              />
            </View>
            <View className="mt-3 space-y-3">
              <View className="rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900">
                    Vehicle Request Approved
                  </Text>
                  <Text className="text-sm text-gray-600">2h ago</Text>
                </View>
                <Text className="mt-1 text-sm text-gray-600">
                  For: Sales Department
                </Text>
              </View>
              <View className="rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900">
                    Meal Order Reviewed
                  </Text>
                  <Text className="text-sm text-gray-600">5h ago</Text>
                </View>
                <Text className="mt-1 text-sm text-gray-600">
                  Bulk order for event
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PMHomeScreen;
