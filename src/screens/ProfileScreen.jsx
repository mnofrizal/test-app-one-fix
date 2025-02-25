import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { logout as logoutService } from "../services/authService";

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

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      "Keluar",
      "Apakah Anda yakin ingin keluar?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Keluar",
          onPress: async () => {
            await logoutService();
            logout();
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-900 px-6 pb-12 pt-14">
        <View className="items-center">
          <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-blue-800">
            <MaterialCommunityIcons name="account" size={64} color="white" />
          </View>
          <Text className="text-2xl font-bold text-white">{user?.name}</Text>
          <Text className="mt-1 text-blue-200">{user?.role}</Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View className="-mt-8 flex-row px-4">
        <View
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 4,
            boxShadow: "0 0 8px rgba(0, 0, 0, 0.1)", // Added glow effect
          }}
          className="flex-1 flex-row items-center justify-between rounded-l-xl rounded-r-xl bg-white p-4 shadow-sm"
        >
          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900">0</Text>
            <Text className="text-sm text-gray-500">Pesanan</Text>
          </View>

          <View className="h-full w-px bg-gray-200" />

          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900">0</Text>
            <Text className="text-sm text-gray-500">Aktif</Text>
          </View>

          <View className="h-full w-px bg-gray-200" />

          <View className="flex-1 items-center">
            <Text className="text-2xl font-bold text-gray-900">0</Text>
            <Text className="text-sm text-gray-500">Pending</Text>
          </View>
        </View>
      </View>

      {/* Options */}
      <View className="p-4">
        <Text className="mb-4 text-base font-semibold text-gray-900">
          Pengaturan Akun
        </Text>

        <ProfileOption
          icon="account-edit"
          title="Edit Profil"
          subtitle="Perbarui informasi Anda"
        />

        {user?.role === "ADMIN" && (
          <ProfileOption
            icon="whatsapp"
            title="Whatsapp Notifikasi"
            subtitle="Kelola Whatsapp notifikasi"
            onPress={() => navigation.navigate("WhatsappSetting")}
          />
        )}

        <Text className="mb-4 mt-6 text-base font-semibold text-gray-900">
          Dukungan
        </Text>

        <ProfileOption
          icon="help-circle"
          title="Pusat Bantuan"
          subtitle="Tutorial dan pertanyaan umum"
          color="#059669"
        />

        <ProfileOption
          icon="information"
          title="Tentang"
          subtitle="Pelajari lebih lanjut aplikasi ini"
          color="#059669"
        />

        <Text className="mb-4 mt-6 text-base font-semibold text-gray-900">
          Akun
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
              Log out
            </Text>
            <Text className="text-sm text-gray-500">Keluar dari akun Anda</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
