import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

const SecretaryHomeScreen = () => {
  const { user, logout } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            Secretary Panel
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
        <View className="rounded-2xl border-2 border-pink-100 bg-pink-50 p-4">
          <View className="mb-4 flex-row items-center">
            <MaterialCommunityIcons
              name="calendar-check"
              size={24}
              color="#BE185D"
            />
            <Text className="ml-2 text-lg font-semibold text-pink-900">
              Service Requests Overview
            </Text>
          </View>
          <Text className="text-base text-pink-700">
            Monitor and manage service requests
          </Text>
        </View>

        <View className="mt-6 space-y-4">
          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Active Requests
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
                    Meal Orders
                  </Text>
                </View>
                <View className="rounded-full bg-blue-100 px-3 py-1">
                  <Text className="text-sm text-blue-800">5 pending</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="car"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text className="ml-2 font-medium text-gray-900">
                    Vehicle Requests
                  </Text>
                </View>
                <View className="rounded-full bg-blue-100 px-3 py-1">
                  <Text className="text-sm text-blue-800">3 pending</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                Quick Actions
              </Text>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={24}
                color="#4F46E5"
              />
            </View>
            <View className="mt-3 space-y-2">
              <TouchableOpacity className="flex-row items-center justify-between rounded-lg bg-indigo-50 p-4">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="plus-circle"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text className="ml-2 font-medium text-indigo-900">
                    Create Meal Order
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#4F46E5"
                />
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center justify-between rounded-lg bg-indigo-50 p-4">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="calendar-plus"
                    size={20}
                    color="#4F46E5"
                  />
                  <Text className="ml-2 font-medium text-indigo-900">
                    Schedule Vehicle
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#4F46E5"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-900">
              Recent Activity
            </Text>
            <View className="mt-3 space-y-3">
              <View className="rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900">
                    Meal Order Created
                  </Text>
                  <Text className="text-sm text-gray-600">10m ago</Text>
                </View>
                <Text className="mt-1 text-sm text-gray-600">
                  For: Engineering Dept
                </Text>
              </View>
              <View className="rounded-lg bg-gray-50 p-3">
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium text-gray-900">
                    Vehicle Request Processed
                  </Text>
                  <Text className="text-sm text-gray-600">1h ago</Text>
                </View>
                <Text className="mt-1 text-sm text-gray-600">
                  Status: Awaiting Approval
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SecretaryHomeScreen;
