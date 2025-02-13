import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileSection = ({ title, children }) => (
  <View className="mb-8">
    <Text className="mb-4 text-xl font-bold tracking-tight text-gray-900">
      {title}
    </Text>
    <View className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {children}
    </View>
  </View>
);

const ProfileItem = ({ icon, title, value, action, showBorder = true }) => (
  <TouchableOpacity
    className={`flex-row items-center justify-between p-4 ${
      showBorder ? "border-b border-slate-100" : ""
    }`}
    onPress={action}
  >
    <View className="flex-row items-center">
      <View className="mr-4 rounded-xl bg-slate-50 p-3">
        <MaterialCommunityIcons name={icon} size={22} color="#4F46E5" />
      </View>
      <View>
        <Text className="text-base font-medium text-gray-900">{title}</Text>
        {value && (
          <Text className="text-sm font-medium text-slate-500">{value}</Text>
        )}
      </View>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#64748B" />
  </TouchableOpacity>
);

const ProfileScreen = () => {
  // Mock user data - replace with real data
  const user = {
    name: "John Doe",
    email: "john.doe@company.com",
    department: "IT Department",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/300",
  };

  return (
    <ScrollView className="flex-1 bg-slate-50">
      {/* Header Section */}
      <View className="bg-white px-6 pb-8 pt-10 shadow-sm">
        <View className="items-center">
          <View className="mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-indigo-100 shadow-sm">
            <Image
              source={{ uri: user.avatar }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <Text className="mb-1 text-2xl font-bold tracking-tight text-gray-900">
            {user.name}
          </Text>
          <Text className="text-base font-medium text-slate-500">
            {user.department}
          </Text>
        </View>
      </View>

      <View className="p-6">
        {/* Profile Info Section */}
        <ProfileSection title="Profile Information">
          <ProfileItem
            icon="email"
            title="Email"
            value={user.email}
            action={() => {}}
          />
          <ProfileItem
            icon="briefcase"
            title="Department"
            value={user.department}
            action={() => {}}
          />
          <ProfileItem
            icon="badge-account"
            title="Role"
            value={user.role}
            action={() => {}}
            showBorder={false}
          />
        </ProfileSection>

        {/* Preferences Section */}
        <ProfileSection title="Preferences">
          <ProfileItem
            icon="bell"
            title="Notifications"
            value="Enabled"
            action={() => {}}
          />
          <ProfileItem
            icon="translate"
            title="Language"
            value="English"
            action={() => {}}
          />
          <ProfileItem
            icon="theme-light-dark"
            title="Theme"
            value="Light"
            action={() => {}}
            showBorder={false}
          />
        </ProfileSection>

        {/* Support Section */}
        <ProfileSection title="Support">
          <ProfileItem
            icon="help-circle"
            title="Help Center"
            action={() => {}}
          />
          <ProfileItem icon="information" title="About" action={() => {}} />
          <ProfileItem
            icon="book"
            title="Terms & Privacy"
            action={() => {}}
            showBorder={false}
          />
        </ProfileSection>

        {/* Account Actions */}
        <View className="mt-4">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-red-50 p-4"
            onPress={() => {}}
          >
            <MaterialCommunityIcons
              name="logout"
              size={22}
              color="#DC2626"
              style={{ marginRight: 8 }}
            />
            <Text className="text-base font-semibold text-red-600">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
