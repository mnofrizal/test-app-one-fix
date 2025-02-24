import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  ToastAndroid,
  RefreshControl,
  ActivityIndicator,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";
import { useKitchenStore } from "../store/kitchenStore";
import { SkeletonOrderList } from "../components/SkeletonOrderCard";

const OrderCard = ({ order, onPress, style }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        className="mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-md"
        onPress={() => onPress(order)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={0.9}
      >
        <View className="flex-row items-start justify-between">
          <View className="mr-3 flex-1">
            <Text className="text-base font-medium text-gray-900">
              #{order.id || "-"}
            </Text>
            <Text className="mt-1 text-sm font-medium text-gray-700">
              {truncateText(order.judulPekerjaan)}
            </Text>
            <View className="mt-1 flex-row items-center">
              <MaterialCommunityIcons name="tag" size={16} color="#6B7280" />
              <Text className="ml-1 text-sm text-gray-600">
                {order.category || "-"}
              </Text>
              <MaterialCommunityIcons
                name="map-marker"
                size={16}
                color="#6B7280"
                style={{ marginLeft: 8 }}
              />
              <Text className="ml-1 text-sm text-gray-600">
                {order.dropPoint || "-"}
              </Text>
            </View>
            <Text className="mt-1 text-sm text-gray-600">
              Total Item: {totalItems}
            </Text>
          </View>
          <View className="rounded-full bg-blue-100 px-2.5 py-1">
            <Text className="text-sm font-medium text-blue-800">
              {formatDate(order.requestDate)}
            </Text>
          </View>
        </View>
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-sm font-medium text-gray-600">
            PIC: {order.pic?.name || "-"}
          </Text>
          <View
            className={`rounded-full px-2.5 py-1 ${getStatusColor(
              order.status
            )}`}
          >
            <Text className="text-sm font-medium">
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
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

  React.useEffect(() => {
    const backAction = () => {
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
      className={`flex-1 flex-row items-center justify-center border-b-2 px-2 py-3 ${
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
      {/* Scrollable Content with Sticky Tabs */}
      <ScrollView
        style={{ flex: 1 }}
        stickyHeaderIndices={[2]} // Updated index since header is now scrollable
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={async () => {
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
              await fetchKitchenStats();
            }}
          />
        }
      >
        {/* Scrollable Header */}
        <View className="bg-white px-4 py-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-900">Dapur</Text>
              <Text className="text-sm text-gray-600">
                Selamat Datang, {user?.name}
              </Text>
            </View>
            <TouchableOpacity>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  className="h-12 w-12 rounded-full"
                />
              ) : (
                <View className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <MaterialCommunityIcons
                    name="account"
                    size={28}
                    color="#1E40AF"
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Cards Section */}
        <View className="px-4 py-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            <View className="mr-4 w-48 rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-md">
              <View>
                <Text className="text-base font-medium text-blue-700">
                  Menunggu
                </Text>
                <Text className="mt-2 text-4xl font-bold text-blue-900">
                  {Number(stats.PENDING_KITCHEN || 0)}
                </Text>
              </View>
            </View>
            <View className="mr-4 w-52 rounded-3xl border border-yellow-100 bg-yellow-50 p-5 shadow-md">
              <View>
                <Text className="text-base font-medium text-yellow-700">
                  Diproses
                </Text>
                <Text className="mt-2 text-4xl font-bold text-yellow-900">
                  {Number(stats.IN_PROGRESS || 0)}
                </Text>
              </View>
            </View>
            <View className="w-52 rounded-2xl border border-green-100 bg-green-50 p-5 shadow-md">
              <View>
                <Text className="text-base font-medium text-green-700">
                  Selesai
                </Text>
                <Text className="mt-2 text-4xl font-bold text-green-900">
                  {Number(stats.COMPLETED || 0)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Sticky Tabs */}
        <View className="bg-white">
          <View className="flex-row justify-between border-b border-gray-200">
            <TabItem
              name="PENDING_KITCHEN"
              label="Menunggu"
              icon="clock-outline"
            />
            <TabItem
              name="IN_PROGRESS"
              label="Diproses"
              icon="progress-clock"
            />
            <TabItem name="COMPLETED" label="Selesai" icon="check-circle" />
          </View>
        </View>

        {/* Order List */}
        <View className="flex-1 px-4 pb-4 pt-4">
          {isLoading ? (
            <SkeletonOrderList />
          ) : getActiveOrders().length === 0 ? (
            <View className="items-center justify-center py-12">
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={48}
                color="#9CA3AF"
              />
              <Text className="mt-4 text-base text-gray-500">
                Belum ada pesanan yang{" "}
                {activeTab === "PENDING_KITCHEN"
                  ? "menunggu"
                  : activeTab === "IN_PROGRESS"
                  ? "diproses"
                  : "selesai"}
              </Text>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default KitchenHomeScreen;
