import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  ToastAndroid,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { useKitchenStore } from "../store/kitchenStore";

const OrderCard = ({ order, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_KITCHEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENDING_KITCHEN":
        return "Menunggu";
      case "IN_PROGRESS":
        return "Diproses";
      case "COMPLETED":
        return "Selesai";
      case "CANCELED":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  // Calculate total items from all employee orders
  const totalItems = order.employeeOrders.reduce((total, employee) => {
    return (
      total + employee.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    );
  }, 0);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `Jam ${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const truncateText = (text, length = 30) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  return (
    <TouchableOpacity
      className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      onPress={() => onPress(order)}
    >
      <View className="flex-row items-start justify-between">
        <View className="mr-3 flex-1">
          <Text className="text-base font-medium text-gray-900">
            #{order.id || "-"}
          </Text>
          <Text className="mt-1 text-sm text-gray-600">
            {truncateText(order.judulPekerjaan)}
          </Text>
          <Text className="text-sm text-gray-600">
            {order.category || "-"} - {order.dropPoint || "-"}
          </Text>
          <Text className="text-sm text-gray-600">
            Total Item: {totalItems}
          </Text>
        </View>
        <View className="rounded-full bg-blue-100 px-3 py-1">
          <Text className="text-sm font-medium text-blue-800">
            {formatDate(order.requestDate)}
          </Text>
        </View>
      </View>
      <View className="mt-3 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-gray-600">
          PIC: {order.pic?.name || "-"}
        </Text>
        <View
          className={`rounded-full px-3 py-1 ${getStatusColor(order.status)}`}
        >
          <Text className="text-sm font-medium">
            {getStatusText(order.status)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const KitchenHomeScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const {
    pendingOrders,
    inProgressOrders,
    completedOrders,
    stats,
    isLoading,
    error,
    fetchPendingOrders,
    fetchInProgressOrders,
    fetchCompletedOrders,
    fetchKitchenStats,
    clearError,
  } = useKitchenStore();

  const [activeTab, setActiveTab] = React.useState("PENDING_KITCHEN");
  const [exitApp, setExitApp] = React.useState(false);

  // Fetch initial data
  React.useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchPendingOrders(),
        fetchInProgressOrders(),
        fetchCompletedOrders(),
        fetchKitchenStats(),
      ]);
    };

    loadData();
  }, []);

  // Fetch data when tab changes
  React.useEffect(() => {
    const fetchData = async () => {
      switch (activeTab) {
        case "PENDING_KITCHEN":
          await fetchPendingOrders();
          break;
        case "IN_PROGRESS":
          await fetchInProgressOrders();
          break;
        case "COMPLETED":
          await fetchCompletedOrders();
          break;
      }
    };

    fetchData();
  }, [activeTab]);

  // Back handler effect
  React.useEffect(() => {
    const backAction = () => {
      // Only handle back press if this is the focused screen
      if (navigation.isFocused()) {
        if (!exitApp) {
          setExitApp(true);
          ToastAndroid.show(
            "Tekan sekali lagi untuk keluar",
            ToastAndroid.SHORT
          );
          setTimeout(() => {
            setExitApp(false);
          }, 2000);
          return true;
        } else {
          BackHandler.exitApp();
          return false;
        }
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [exitApp, navigation]);

  // Map active tab to corresponding orders
  const getActiveOrders = () => {
    switch (activeTab) {
      case "PENDING_KITCHEN":
        return pendingOrders;
      case "IN_PROGRESS":
        return inProgressOrders;
      case "COMPLETED":
        return completedOrders;
      default:
        return [];
    }
  };

  // Error handling with toast
  React.useEffect(() => {
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      clearError();
    }
  }, [error]);

  const handleOrderPress = (order) => {
    navigation.navigate("KitchenOrderDetail", { order });
  };

  const TabItem = ({ name, label, icon }) => (
    <TouchableOpacity
      className={`mr-4 flex-row items-center border-b-2 px-2 py-4 ${
        activeTab === name ? "border-blue-600" : "border-transparent"
      }`}
      onPress={() => setActiveTab(name)}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={activeTab === name ? "#2563EB" : "#6B7280"}
        style={{ marginRight: 4 }}
      />
      <Text
        className={`font-medium ${
          activeTab === name ? "text-blue-600" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Dapur</Text>
          <Text className="text-base text-gray-600">
            Selamat Datang, {user?.name}
          </Text>
        </View>
        <TouchableOpacity>
          {user?.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <View className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <MaterialCommunityIcons
                name="account"
                size={24}
                color="#1E40AF"
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View className="flex-row p-4">
        <View className="mr-2 flex-1 rounded-xl bg-blue-50 p-4">
          <View className="items-center">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="clock-outline"
                size={24}
                color="#2563EB"
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm font-medium text-blue-600">
                Menunggu
              </Text>
            </View>
            <Text className="mt-2 text-4xl font-bold text-blue-900">
              {Number(stats.PENDING_KITCHEN || 0)}
            </Text>
          </View>
        </View>
        <View className="ml-2 flex-1 rounded-xl bg-yellow-50 p-4">
          <View className="items-center">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="progress-clock"
                size={24}
                color="#CA8A04"
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm font-medium text-yellow-600">
                Diproses
              </Text>
            </View>
            <Text className="mt-2 text-4xl font-bold text-yellow-900">
              {Number(stats.IN_PROGRESS || 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Tabs */}
      <View className="flex-row justify-between border-b border-gray-200 bg-white px-4">
        <TabItem name="PENDING_KITCHEN" label="Menunggu" icon="clock-outline" />
        <TabItem name="IN_PROGRESS" label="Diproses" icon="progress-clock" />
        <TabItem name="COMPLETED" label="Selesai" icon="check-circle" />
      </View>

      {/* Order List */}
      <ScrollView className="flex-1 p-4">
        {isLoading ? (
          <View className="items-center justify-center p-4">
            <Text className="text-gray-600">Memuat data...</Text>
          </View>
        ) : getActiveOrders().length === 0 ? (
          <View className="items-center justify-center p-4">
            <Text className="text-gray-600">Tidak ada pesanan</Text>
          </View>
        ) : (
          getActiveOrders().map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onPress={handleOrderPress}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default KitchenHomeScreen;
