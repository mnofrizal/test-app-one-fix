import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useKitchenStore } from "../store/kitchenStore";

const MenuItemCard = ({ item, employeeName, entity }) => (
  <View className="mb-3 rounded-xl border border-gray-200 bg-white shadow-sm">
    {/* Main Content */}
    <View className="p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="rounded-lg bg-blue-50 px-3 py-3">
            <View className="flex-row items-center">
              <Text className="ml-1 text-xl font-semibold text-blue-600">
                {item.quantity}×
              </Text>
            </View>
          </View>
          <View className="ml-3">
            <Text className="text-lg font-semibold text-gray-900">
              {item.menuItem.name}
            </Text>
            <View className="mt-1 flex-row items-center">
              <Text className="text-xs text-gray-600">
                Notes: {item.notes || "-"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const ConfirmationDialog = ({ visible, onClose, onConfirm, isLoading }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View className="flex-1 items-center justify-center bg-black/50 px-4">
      <View className="w-full max-w-sm rounded-2xl bg-white p-6">
        <View className="mb-4 items-center">
          <View className="mb-3 rounded-full bg-blue-100 p-3">
            <MaterialCommunityIcons
              name="progress-clock"
              size={32}
              color="#1D4ED8"
            />
          </View>
          <Text className="text-xl font-semibold text-gray-900">
            Konfirmasi Proses
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-600">
            Apakah Anda yakin ingin memproses pesanan ini?
          </Text>
        </View>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-3"
            onPress={onClose}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
            <Text className="ml-2 text-center font-medium text-gray-700">
              Batal
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center rounded-xl bg-blue-600 py-3"
            onPress={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={20} color="white" />
                <Text className="ml-2 text-center font-medium text-white">
                  Ya, Proses
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const KitchenOrderDetailScreen = ({ route, navigation }) => {
  const { orderId, order: initialOrder } = route.params || {};
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const {
    startOrder,
    isLoading,
    error,
    clearError,
    fetchOrderDetails,
    selectedOrder,
    setSelectedOrder,
  } = useKitchenStore();

  // State
  const [order, setOrder] = useState(initialOrder);

  // Effects
  useEffect(() => {
    const loadOrder = async () => {
      // Clear previous order data
      setOrder(initialOrder);

      // Always fetch fresh data for notifications
      if (orderId) {
        await fetchOrderDetails(orderId);
      }
    };
    loadOrder();

    // Cleanup on unmount or when orderId changes
    return () => {
      setOrder(null);
      setSelectedOrder(null); // Clear store state on unmount
    };
  }, [orderId, initialOrder, fetchOrderDetails]);

  useEffect(() => {
    if (selectedOrder) {
      setOrder(selectedOrder);
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      clearError();
    }
  }, [error, clearError]);

  // Loading state
  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1d4ed8" />
          <Text className="mt-4 text-gray-600">Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    } catch (error) {
      return "-";
    }
  };

  const getTotalItems = (orders) => {
    try {
      return (
        orders?.reduce(
          (total, employee) =>
            total +
            (employee.orderItems?.reduce(
              (sum, item) => sum + (item.quantity || 0),
              0
            ) || 0),
          0
        ) || 0
      );
    } catch (error) {
      return 0;
    }
  };

  const handleProcessOrder = () => {
    setShowConfirmation(true);
  };

  const handleCompletePress = () => {
    navigation.navigate("KitchenOrderComplete", { order });
  };

  const handleConfirmProcess = async () => {
    setLocalIsLoading(true);
    try {
      const result = await startOrder(order.id);
      if (result.success) {
        ToastAndroid.show("Pesanan sedang diproses", ToastAndroid.SHORT);
        navigation.goBack();
      }
    } finally {
      setShowConfirmation(false);
      setLocalIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-6 py-3 shadow-lg">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <View>
            <Text className="text-xl font-semibold text-black">
              Detail Pesanan
            </Text>
            <Text className="text-sm text-black">Order #{order.id || "-"}</Text>
          </View>
        </View>
        <View
          className={`rounded-full px-3 py-1 ${
            order.status === "PENDING_KITCHEN"
              ? "bg-blue-100"
              : order.status === "IN_PROGRESS"
              ? "bg-yellow-100"
              : order.status === "COMPLETED"
              ? "bg-green-100"
              : order.status === "CANCELED"
              ? "bg-red-100"
              : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              order.status === "PENDING_KITCHEN"
                ? "text-blue-800"
                : order.status === "IN_PROGRESS"
                ? "text-yellow-800"
                : order.status === "COMPLETED"
                ? "text-green-800"
                : order.status === "CANCELED"
                ? "text-red-800"
                : "text-gray-800"
            }`}
          >
            {order.status === "PENDING_KITCHEN"
              ? "Menunggu"
              : order.status === "IN_PROGRESS"
              ? "Diproses"
              : order.status === "COMPLETED"
              ? "Selesai"
              : order.status === "CANCELED"
              ? "Dibatalkan"
              : "Unknown"}
          </Text>
        </View>
      </View>

      {/* Order Info */}
      {/* Order Info */}
      <View className="bg-white p-6 py-2 pb-0 pt-4">
        <Text className="mb-4 text-lg font-semibold text-gray-900">
          {order.judulPekerjaan}
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white p-6 py-2 pt-0 shadow-lg">
          <View className="flex-row flex-wrap border-t border-gray-100 pt-3">
            <View className="mb-4 w-1/2">
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-600">Kategori</Text>
              </View>
              <View className="mt-1 self-start rounded-md bg-blue-100 px-3 py-1">
                <Text className="text-sm font-semibold uppercase text-blue-800">
                  {order.category}
                </Text>
              </View>
            </View>
            <View className="mb-4 w-1/2 pr-2">
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-600">Lokasi</Text>
              </View>
              <Text className="mt-1 text-sm font-semibold text-gray-900">
                {order.dropPoint}
              </Text>
            </View>

            <View className="mb-3 w-1/2 pr-2">
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-600">PIC</Text>
              </View>
              <Text className="mt-1 text-sm font-semibold capitalize text-gray-900">
                {order.pic.name}
              </Text>
              <Text className="text-xs text-gray-600">{order.pic.nomorHp}</Text>
            </View>
            <View className="mb-3 w-1/2">
              <View className="flex-row items-center">
                <Text className="text-xs text-gray-600">Sub Bidang</Text>
              </View>
              <Text className="mt-1 text-sm font-semibold capitalize text-gray-900">
                {order.supervisor.subBidang}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="p-4">
          <View className="mb-4 flex-row items-center justify-between rounded-lg bg-white p-4 shadow-sm">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="clipboard-list"
                size={20}
                color="#4B5563"
              />
              <Text className="ml-2 text-base font-semibold text-gray-900">
                Daftar Pesanan
              </Text>
            </View>
            <View className="flex-row items-center rounded-full bg-blue-50 px-3 py-1">
              <MaterialCommunityIcons name="food" size={16} color="#1D4ED8" />
              <Text className="ml-1 text-sm font-medium text-blue-700">
                {getTotalItems(order.employeeOrders)} Item
              </Text>
            </View>
          </View>
          {!order.employeeOrders?.length ? (
            <View className="rounded-xl border border-gray-200 bg-white p-6">
              <Text className="text-center text-gray-600">
                Tidak ada item pesanan
              </Text>
            </View>
          ) : (
            (() => {
              // Group items across all employees
              const allGroupedItems = order.employeeOrders.reduce(
                (acc, employee) => {
                  employee.orderItems?.forEach((item) => {
                    const key = item.menuItem.name;
                    if (!acc[key]) {
                      acc[key] = {
                        ...item,
                        quantity: 0,
                      };
                    }
                    acc[key].quantity += item.quantity;
                  });
                  return acc;
                },
                {}
              );

              return Object.values(allGroupedItems).map((item) => (
                <MenuItemCard
                  key={item.menuItem.name}
                  item={item}
                  employeeName=""
                  entity=""
                />
              ));
            })()
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      {order.status === "PENDING_KITCHEN" ? (
        <View className="border-t border-gray-200 bg-white p-4">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-blue-600 py-4"
            onPress={handleProcessOrder}
            disabled={isLoading || localIsLoading}
          >
            {isLoading || localIsLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="play-circle-outline"
                  size={24}
                  color="white"
                />
                <Text className="ml-2 text-center font-semibold text-white">
                  Mulai Proses Pesanan
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : order.status === "IN_PROGRESS" ? (
        <View className="border-t border-gray-200 bg-white p-4">
          <TouchableOpacity
            className="flex-row items-center justify-center space-x-2 rounded-xl bg-green-600 py-4"
            onPress={handleCompletePress}
            disabled={isLoading || localIsLoading}
          >
            {isLoading || localIsLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check-circle-outline"
                  size={24}
                  color="white"
                />
                <Text className="font-semibold text-white">
                  Selesaikan Pesanan
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmProcess}
        isLoading={isLoading || localIsLoading}
      />
    </SafeAreaView>
  );
};

export default KitchenOrderDetailScreen;
