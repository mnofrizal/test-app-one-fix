import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useKitchenStore } from "../store/kitchenStore";

const MenuItemCard = ({ item, employeeName, entity }) => (
  <View className="mb-3 rounded-xl border border-gray-200 bg-white p-4">
    <View className="flex-row items-start justify-between">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">
          {item.menuItem.name}
        </Text>
        <Text className="mt-1 text-sm text-gray-600">
          Jumlah: {item.quantity}
        </Text>
        <Text className="text-sm text-gray-600">
          Catatan: {item.notes || "-"}
        </Text>
        <Text className="mt-1 text-sm font-medium text-gray-700">
          {employeeName} - {entity}
        </Text>
      </View>
      <View className="rounded-full bg-blue-100 px-3 py-1">
        <Text className="text-sm font-medium text-blue-800">
          {item.menuItem.category}
        </Text>
      </View>
    </View>
  </View>
);

const ConfirmationDialog = ({ visible, onClose, onConfirm, isLoading }) => (
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
            disabled={isLoading}
          >
            <Text className="text-center font-medium text-gray-700">Batal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 rounded-xl bg-blue-600 py-3"
            onPress={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-medium text-white">
                Ya, Proses
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const KitchenOrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [localIsLoading, setLocalIsLoading] = useState(false);
  const { startOrder, isLoading, error, clearError } = useKitchenStore();

  // Handle errors with toast
  React.useEffect(() => {
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      clearError();
    }
  }, [error]);

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
            <Text className="text-base text-gray-600">
              Order #{order.id || "-"}
            </Text>
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
      <View className="bg-white p-4 shadow-sm">
        <Text className="mb-4 text-lg font-semibold text-gray-900">
          {order.judulPekerjaan}
        </Text>
        <View className="flex-row flex-wrap">
          <View className="mb-4 w-1/2 pr-2">
            <Text className="text-base text-gray-600">Jenis</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.type}
            </Text>
          </View>
          <View className="mb-4 w-1/2 pl-2">
            <Text className="text-base text-gray-600">Kategori</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.category}
            </Text>
          </View>
          <View className="mb-4 w-1/2 pr-2">
            <Text className="text-base text-gray-600">Lokasi</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.dropPoint}
            </Text>
          </View>
          <View className="mb-4 w-1/2 pl-2">
            <Text className="text-base text-gray-600">Waktu Request</Text>
            <Text className="text-lg font-semibold text-gray-900">
              Jam {formatDate(order.requestDate)}
            </Text>
          </View>
          <View className="mb-4 w-1/2 pr-2">
            <Text className="text-base text-gray-600">PIC</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.pic.name}
            </Text>
            <Text className="text-sm text-gray-600">{order.pic.nomorHp}</Text>
          </View>
          <View className="mb-4 w-1/2 pl-2">
            <Text className="text-base text-gray-600">Supervisor</Text>
            <Text className="text-lg font-semibold text-gray-900">
              {order.supervisor.name}
            </Text>
            <Text className="text-sm text-gray-600">
              {order.supervisor.subBidang}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView className="flex-1 p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900">
            Daftar Menu
          </Text>
          <Text className="text-base text-gray-600">
            Total Item: {getTotalItems(order.employeeOrders)}
          </Text>
        </View>
        {order.employeeOrders?.length === 0 ? (
          <View className="rounded-xl border border-gray-200 bg-white p-6">
            <Text className="text-center text-gray-600">
              Tidak ada item pesanan
            </Text>
          </View>
        ) : (
          order.employeeOrders?.map((employee) => (
            <View key={employee.id} className="mb-6">
              <View className="mb-2 flex-row items-center justify-between">
                <View>
                  <Text className="font-medium text-gray-900">
                    {employee.employeeName}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    {employee.entity}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600">
                  {employee.orderItems?.reduce(
                    (sum, item) => sum + (item.quantity || 0),
                    0
                  )}{" "}
                  item
                </Text>
              </View>
              {employee.orderItems?.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  employeeName={employee.employeeName}
                  entity={employee.entity}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Button */}
      {order.status === "PENDING_KITCHEN" ? (
        <View className="border-t border-gray-200 bg-white p-4">
          <TouchableOpacity
            className="rounded-xl bg-blue-600 py-4"
            onPress={handleProcessOrder}
            disabled={isLoading || localIsLoading}
          >
            {isLoading || localIsLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-center font-semibold text-white">
                Mulai Proses Pesanan
              </Text>
            )}
          </TouchableOpacity>
        </View>
      ) : order.status === "IN_PROGRESS" ? (
        <View className="border-t border-gray-200 bg-white p-4">
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-xl bg-green-600 py-4"
            onPress={handleCompletePress}
            disabled={isLoading || localIsLoading}
          >
            {isLoading || localIsLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-white">
                Selesaikan Pesanan
              </Text>
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
