import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileOption = ({
  icon,
  title,
  subtitle,
  onPress,
  color = "#4F46E5",
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="mb-4 flex-row items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
  >
    <View className={`rounded-xl bg-${color}/10 p-3`}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
    </View>
    <View className="ml-4 flex-1">
      <Text className="text-base font-semibold text-gray-900">{title}</Text>
      {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: logout,
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-blue-900 px-6 pb-8 pt-4">
          <View className="items-center">
            <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-blue-800">
              <MaterialCommunityIcons name="account" size={64} color="white" />
            </View>
            <Text className="text-2xl font-bold text-white">{user?.name}</Text>
            <Text className="mt-1 text-blue-200">{user?.role}</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View className="-mt-4 flex-row px-4">
          <View className="flex-1 rounded-xl bg-white p-4 shadow-sm">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">24</Text>
              <Text className="text-sm text-gray-500">Orders</Text>
            </View>
          </View>
          <View className="mx-2" />
          <View className="flex-1 rounded-xl bg-white p-4 shadow-sm">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">12</Text>
              <Text className="text-sm text-gray-500">Active</Text>
            </View>
          </View>
          <View className="mx-2" />
          <View className="flex-1 rounded-xl bg-white p-4 shadow-sm">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">8</Text>
              <Text className="text-sm text-gray-500">Pending</Text>
            </View>
          </View>
        </View>

        {/* Options */}
        <View className="p-4">
          <Text className="mb-4 text-base font-semibold text-gray-900">
            Account Settings
          </Text>

          <ProfileOption
            icon="account-edit"
            title="Edit Profile"
            subtitle="Update your information"
          />

          <ProfileOption
            icon="bell-outline"
            title="Notifications"
            subtitle="Manage your notifications"
          />

          <ProfileOption
            icon="shield-check"
            title="Privacy"
            subtitle="Manage your privacy settings"
          />

          <Text className="mb-4 mt-6 text-base font-semibold text-gray-900">
            Support
          </Text>

          <ProfileOption
            icon="help-circle"
            title="Help Center"
            subtitle="Get help with your orders"
            color="#059669"
          />

          <ProfileOption
            icon="information"
            title="About"
            subtitle="Learn more about our service"
            color="#059669"
          />

          <Text className="mb-4 mt-6 text-base font-semibold text-gray-900">
            Account
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <View className="rounded-xl bg-red-50 p-3">
              <MaterialCommunityIcons name="logout" size={24} color="#DC2626" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-base font-semibold text-red-600">
                Logout
              </Text>
              <Text className="text-sm text-gray-500">
                Sign out of your account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
