import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const MenuItemCard = ({ item }) => (
  <View className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
    <View className="flex-row items-start justify-between">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">{item.name}</Text>
        <Text className="mt-1 text-sm text-gray-600">
          Jumlah: {item.quantity}
        </Text>
        <Text className="text-sm text-gray-600">
          Catatan: {item.notes || "-"}
        </Text>
      </View>
      <View className="rounded-full bg-blue-100 px-3 py-1">
        <Text className="text-sm font-medium text-blue-800">#{item.id}</Text>
      </View>
    </View>
  </View>
);

const ConfirmationDialog = ({ visible, onClose, onConfirm }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="flex-1 items-center justify-center bg-black/50 px-4">
      <View className="w-full max-w-sm rounded-2xl bg-white p-6">
        <Text className="mb-2 text-xl font-semibold text-gray-900">
          Konfirmasi Proses
        </Text>
        <Text className="mb-6 text-base text-gray-600">
          Apakah Anda yakin ingin memproses pesanan ini?
        </Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 rounded-xl border border-gray-300 bg-white py-3"
            onPress={onClose}
          >
            <Text className="text-center font-medium text-gray-700">Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-xl bg-blue-600 py-3"
            onPress={onConfirm}
          >
            <Text className="text-center font-medium text-white">
              Ya, Proses
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const KitchenOrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Dummy menu items
  const menuItems = [
    { id: "1", name: "Nasi Goreng Spesial", quantity: 3, notes: "Pedas" },
    { id: "2", name: "Ayam Bakar", quantity: 2, notes: "Tidak pedas" },
    { id: "3", name: "Es Teh Manis", quantity: 5, notes: "" },
  ];

  const handleProcessOrder = () => {
    setShowConfirmation(true);
  };

  const handleCompletePress = (order) => {
    navigation.navigate("KitchenOrderComplete", { order });
  };

  const handleConfirmProcess = () => {
    setShowConfirmation(false);
    // Handle order processing here
    // Then navigate back or to next screen
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#1F2937"
            />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Detail Pesanan
            </Text>
            <Text className="text-base text-gray-600">Order #{order.id}</Text>
          </View>
        </View>
      </View>

      {/* Order Info */}
      <View className="bg-white p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base text-gray-600">Departemen</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.department}
            </Text>
          </View>
          <View>
            <Text className="text-base text-gray-600">PIC</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.picName}
            </Text>
          </View>
          <View>
            <Text className="text-base text-gray-600">Waktu</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.time}
            </Text>
          </View>
          <View>
            <Text className="text-base text-gray-600">Status</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1 p-4">
        <Text className="mb-4 text-lg font-semibold text-gray-900">
          Daftar Menu
        </Text>
        {menuItems.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </ScrollView>

      {/* Bottom Button */}
      {order.status === "masuk" ? (
        <View className="border-t border-gray-200 bg-white p-4">
          <TouchableOpacity
            className="rounded-xl bg-blue-600 py-4"
            onPress={handleProcessOrder}
          >
            <Text className="text-center font-semibold text-white">
              Mulai Proses Pesanan
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="border-t border-gray-200 bg-white p-4">
          <TouchableOpacity
            className={`flex-row items-center justify-center rounded-xl bg-green-600 py-4`}
            onPress={() => handleCompletePress(order)}
          >
            <Text className="font-semibold text-white">Selesaikan Pesanan</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmProcess}
      />
    </SafeAreaView>
  );
};

export default KitchenOrderDetailScreen;
