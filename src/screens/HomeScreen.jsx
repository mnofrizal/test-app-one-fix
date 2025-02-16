import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useAuthStore } from "../store/authStore";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSecretaryStore } from "../store/secretaryStore";
import { useAdminStore } from "../store/adminStore";
import { useEmployeeStore } from "../store/employeeStore";
import useStore from "../store/useStore";
import { ActivityIndicator } from "react-native";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const LoadingIndicator = () => (
  <View className="flex-1 items-center justify-center py-4">
    <ActivityIndicator size="large" color="#4F46E5" />
  </View>
);

const ErrorMessage = ({ message, onRetry }) => (
  <View className="items-center justify-center py-4">
    <Text className="mb-2 text-sm text-red-600">{message}</Text>
    {onRetry && (
      <TouchableOpacity
        className="rounded-md bg-indigo-600 px-4 py-2"
        onPress={onRetry}
      >
        <Text className="text-sm font-medium text-white">Retry</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ActiveOrderCard = ({
  title,
  orderNo,
  status,
  eta,
  icon,
  time,
  onPress,
}) => {
  const getStatusStyles = (color) => {
    switch (color) {
      case "yellow":
        return { bg: "bg-yellow-50", text: "text-yellow-700" };
      case "orange":
        return { bg: "bg-orange-50", text: "text-orange-700" };
      case "purple":
        return { bg: "bg-purple-50", text: "text-purple-700" };
      case "blue":
        return { bg: "bg-blue-50", text: "text-blue-700" };
      case "green":
        return { bg: "bg-green-50", text: "text-green-700" };
      case "red":
        return { bg: "bg-red-50", text: "text-red-700" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700" };
    }
  };

  const statusInfo = formatOrderStatus(status);
  const { bg: statusBg, text: statusColor } = getStatusStyles(statusInfo.color);

  return (
    <TouchableOpacity
      className="mr-4 w-72 rounded-xl border border-gray-300 bg-white p-4 shadow-sm"
      onPress={onPress}
    >
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="rounded-full bg-indigo-50 p-2">
            <MaterialCommunityIcons name={icon} size={20} color="#4F46E5" />
          </View>
          <View className="ml-3">
            <Text className="text-sm font-medium text-gray-900">{title}</Text>
            <Text className="text-xs text-gray-500">{orderNo}</Text>
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#6B7280"
          />
          <Text className="ml-1 text-xs text-gray-500">{time}</Text>
        </View>
        <View className="flex-row items-center">
          <View className={`rounded-full ${statusBg} px-3 py-1`}>
            <Text className={`text-xs font-medium ${statusColor}`}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const WeatherWidget = ({ currentTime }) => (
  <View className="z-20 mt-2 flex-row items-center justify-between rounded-2xl bg-blue-800 p-3 pb-10 shadow-xl">
    <View className="flex-row items-center">
      <MaterialCommunityIcons name="weather-sunny" size={24} color="white" />
      <View className="ml-3">
        <Text className="text-lg font-bold text-white">28°C</Text>
        <Text className="text-sm text-blue-100">Cilegon, Cerah</Text>
      </View>
    </View>
    <Text className="text-3xl font-medium text-white">
      {formatTime(currentTime)}
    </Text>
  </View>
);

const ServiceMenuItem = ({ title, icon, onPress, route }) => {
  const navigation = useNavigation();
  let iconColor = "#4F46E5";
  let bgColor = "bg-indigo-100";

  if (icon === "food") {
    iconColor = "#FFD07A";
    bgColor = "bg-orange-50";
  } else if (icon === "car") {
    iconColor = "#00AACC";
    bgColor = "bg-blue-50";
  } else if (icon === "door") {
    iconColor = "#FF0000";
    bgColor = "bg-red-50";
  } else if (icon === "pencil") {
    iconColor = "#00A0A0";
    bgColor = "bg-teal-50";
  }

  const handlePress = () => {
    if (route) {
      navigation.navigate(route);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      className="h-24 flex-1 items-center justify-center"
      onPress={handlePress}
    >
      <View
        className={`mb-3 h-16 w-16 items-center justify-center rounded-full ${bgColor} shadow-xl`}
      >
        <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
      </View>
      <Text className="font-base text-center text-sm text-gray-900">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const ServiceExtraMenuItem = ({ title, icon, onPress, route }) => {
  const navigation = useNavigation();
  let iconColor = "#4F46E5";
  let bgColor = "bg-indigo-100";

  if (icon === "food") {
    iconColor = "#FFD07A";
    bgColor = "bg-orange-50";
  } else if (icon === "car") {
    iconColor = "#00AACC";
    bgColor = "bg-blue-50";
  } else if (icon === "door") {
    iconColor = "#FF0000";
    bgColor = "bg-red-50";
  } else if (icon === "pencil") {
    iconColor = "#00A0A0";
    bgColor = "bg-teal-50";
  }

  const handlePress = () => {
    if (route) {
      navigation.navigate(route);
    } else if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      className="h-24 flex-1 items-center justify-center"
      onPress={handlePress}
    >
      <View
        className={`mb-3 h-16 w-16 items-center justify-center rounded-full ${bgColor} shadow-xl`}
      >
        <MaterialCommunityIcons name={icon} size={32} color={iconColor} />
      </View>
      <Text className="font-base text-center text-sm text-gray-900">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const SectionHeader = ({ title, more, pillCount, navigation }) => (
  <View className="mb-4 w-full flex-row items-center justify-between">
    <View className="flex-row items-center">
      <Text className="text-lg font-medium tracking-tight text-zinc-800">
        {title}
      </Text>
      {pillCount && (
        <View className="ml-2 rounded-full bg-indigo-50 px-3 py-1">
          <Text className="text-xs font-medium text-indigo-700">
            {pillCount}
          </Text>
        </View>
      )}
    </View>
    <TouchableOpacity onPress={() => navigation.navigate("Order")}>
      <Text className="text-sm font-medium text-indigo-600">{more}</Text>
    </TouchableOpacity>
  </View>
);

const QuickAction = ({ title, icon, onPress }) => (
  <TouchableOpacity
    className="mr-3 flex-row items-center rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm"
    onPress={onPress}
  >
    <MaterialCommunityIcons name={icon} size={18} color="#4F46E5" />
    <Text className="ml-2 text-sm font-medium text-gray-700">{title}</Text>
  </TouchableOpacity>
);

const getIconForOrderType = (type) => {
  switch (type) {
    case "MEAL":
      return "food";
    case "TRANSPORT":
      return "car";
    case "ROOM":
      return "door";
    case "STATIONARY":
      return "pencil";
    default:
      return "file-document-outline";
  }
};

const formatOrderStatus = (status) => {
  switch (status) {
    case "PENDING_SUPERVISOR":
      return { text: "ASMAN", color: "yellow" };
    case "PENDING_GA":
      return { text: "ADMIN", color: "orange" };
    case "PENDING_KITCHEN":
      return { text: "KITCHEN", color: "purple" };
    case "IN_PROGRESS":
      return { text: "PROSES", color: "blue" };
    case "COMPLETED":
      return { text: "SELESAI", color: "green" };
    case "CANCELLED":
      return { text: "CANCEL", color: "red" };
    default:
      return { text: status, color: "gray" };
  }
};

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / 60000);

  if (diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam yang lalu`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Kemarin";
  if (diffInDays < 7) return `${diffInDays} hari yang lalu`;

  return date.toLocaleDateString();
};

const EmptyState = () => (
  <View className="items-center justify-center py-8">
    <MaterialCommunityIcons
      name="clipboard-text-outline"
      size={50}
      color="#9CA3AF"
    />
    <Text className="mt-2 text-base font-medium text-gray-600">
      Belum Ada Aktivitas
    </Text>
    <Text className="text-sm text-gray-500">
      Aktivitas terbaru Anda akan muncul di sini
    </Text>
  </View>
);

const ActivityItem = ({ title, time, status, icon, statusColor, onPress }) => {
  const getStatusStyles = (color) => {
    switch (color) {
      case "yellow":
        return { bg: "bg-yellow-50", text: "text-yellow-700" };
      case "orange":
        return { bg: "bg-orange-50", text: "text-orange-700" };
      case "purple":
        return { bg: "bg-purple-50", text: "text-purple-700" };
      case "blue":
        return { bg: "bg-blue-50", text: "text-blue-700" };
      case "green":
        return { bg: "bg-green-50", text: "text-green-700" };
      case "red":
        return { bg: "bg-red-50", text: "text-red-700" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700" };
    }
  };

  const { bg: bgColor, text: textColor } = getStatusStyles(statusColor);

  return (
    <TouchableOpacity
      className="mb-3 flex-row items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      onPress={onPress}
    >
      <View className="flex-row flex-wrap items-center">
        <View className="mr-3 rounded-full bg-blue-50 p-2">
          <MaterialCommunityIcons name={icon} size={20} color="#4F46E5" />
        </View>
        <View className="max-w-[70%] flex-shrink">
          <Text className="text-sm font-medium text-gray-900">{title}</Text>
          <Text className="text-xs text-gray-500">{time}</Text>
        </View>
      </View>
      <View className={` rounded-full ${bgColor} px-3 py-1`}>
        <Text className={`text-xs font-medium ${textColor}`}>{status}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const requestSummary = useStore((state) => state.requestSummary);
  const user = useAuthStore((state) => state.user);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const heightValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const opacityValue = useSharedValue(0);

  const secretaryStore = useSecretaryStore();
  const adminStore = useAdminStore();

  // Use appropriate store based on user role
  const store = user?.role === "ADMIN" ? adminStore : secretaryStore;

  const {
    orders,
    recentActiveOrders,
    newestOrders,
    loading,
    error,
    fetchOrders,
    fetchRecentActiveOrders,
    fetchRecentActivities,
    fetchStatusStats,
    fetchNewestOrders,
    statusStats,
  } = store;

  const { fetchEmployees } = useEmployeeStore();

  React.useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchOrders(1),
        fetchRecentActiveOrders(),
        fetchRecentActivities(),
        fetchStatusStats(),
        fetchNewestOrders(),
        fetchEmployees(), // Pre-fetch employees data
      ]);
    };
    loadData();
  }, [
    fetchOrders,
    fetchRecentActiveOrders,
    fetchRecentActivities,
    fetchStatusStats,
    fetchNewestOrders,
    fetchEmployees,
  ]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  React.useEffect(() => {
    heightValue.value = withSpring(isExpanded ? 120 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 100,
    });
    rotateValue.value = withSpring(isExpanded ? 180 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 100,
    });
    opacityValue.value = withTiming(isExpanded ? 1 : 0, {
      duration: 200,
    });
  }, [isExpanded]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    maxHeight: heightValue.value,
    opacity: opacityValue.value,
  }));

  const animatedRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotateValue.value}deg` }],
  }));

  const formatGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    return "Selamat Malam";
  };

  const menuItems = [
    { title: "Meal Order", key: "meals", icon: "food", route: "MealOrder" },
    { title: "Transport", key: "transport", icon: "car" },
    { title: "Ruangan", key: "rooms", icon: "door" },
    { title: "ATK", key: "stationary", icon: "pencil" },
  ];

  const extraMenuItems = [
    { title: "Event Meal", key: "event-meal", icon: "food-variant" },
  ];

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchOrders(1),
        fetchRecentActiveOrders(),
        fetchRecentActivities(),
        fetchStatusStats(),
        fetchNewestOrders(),
        fetchEmployees(), // Refresh employees data
      ]);
    } catch (error) {
      console.error("Refresh error:", error);
    }
    setRefreshing(false);
  }, [
    fetchOrders,
    fetchRecentActiveOrders,
    fetchRecentActivities,
    fetchStatusStats,
    fetchNewestOrders,
    fetchEmployees,
  ]);

  return (
    <ScrollView
      className="flex-1 bg-slate-50"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4F46E5"]}
          tintColor="#4F46E5"
          title="Pull to refresh"
        />
      }
    >
      <StatusBar barStyle="dark-content" bakgroundColor="#1E40AF" />
      {/* Header Section */}
      <View className="bg-white px-6 pb-8 pt-10 shadow-lg">
        <View className="absolute -left-[339px] -top-[840px] right-0 z-0">
          <FontAwesome name="circle" size={1250} color="#1c3a8a" />
        </View>
        <View className="absolute -right-2 -top-20 z-10 opacity-20">
          <FontAwesome name="bolt" size={400} color="darkblue" />
        </View>
        <View className="z-50 mb-1 flex-row items-center justify-between">
          <View>
            <Text className="mb-1 text-lg font-medium text-blue-100">
              {formatGreeting()}
            </Text>
            <Text className="text-3xl font-extrabold tracking-tight text-white">
              {user?.name?.replace("Sekretaris", "Sec.") || "User"}
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity
              className="mr-4 rounded-full bg-blue-800 p-2"
              onPress={() => navigation.navigate("Notification")}
            >
              <View className="absolute -right-1 -top-1 z-10 h-4 w-4 items-center justify-center rounded-full bg-red-500">
                <Text className="text-xs font-bold text-white">3</Text>
              </View>
              <MaterialCommunityIcons name="bell" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-gray-300"
              onPress={() => navigation.navigate("Profile")}
            >
              <MaterialCommunityIcons name="account" size={40} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="mb-2 text-base font-medium text-blue-100">
          Mau ngapain hari ini?
        </Text>
        <WeatherWidget currentTime={currentTime} />
      </View>

      <View className="w-full">
        {/* Services Section */}
        <View className="mx-4 -mt-14 shadow-xl">
          <View className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
            <View className="flex-row justify-between">
              {menuItems.map((item) => (
                <ServiceMenuItem
                  key={item.key}
                  title={item.title}
                  icon={item.icon}
                  route={item.route}
                />
              ))}
            </View>

            <Animated.View
              style={animatedContentStyle}
              className="overflow-hidden"
            >
              <View className="mt-4 flex-row justify-between border-t border-gray-100 pt-4">
                {extraMenuItems.map((item) => (
                  <ServiceExtraMenuItem
                    key={item.key}
                    title={item.title}
                    icon={item.icon}
                    route={item.route}
                  />
                ))}
              </View>
            </Animated.View>

            <TouchableOpacity
              className="mt-2 items-center"
              onPress={() => setIsExpanded(!isExpanded)}
            >
              <Animated.View style={animatedRotateStyle}>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={24}
                  color="#6B7280"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mb-2 mt-2 px-4 py-2">
          {/* Quick Actions */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <QuickAction
              title="Event Meal"
              icon="food-variant"
              onPress={() => {}}
            />
            <QuickAction title="Pesan Mobil" icon="car" onPress={() => {}} />
            <QuickAction title="Pesan Ruangan" icon="door" onPress={() => {}} />
            <QuickAction
              title="Permintaan ATK"
              icon="pencil"
              onPress={() => {}}
            />
          </ScrollView>
        </View>

        {/* Main Content */}
        <View className="px-4 pb-4">
          {/* Active Orders */}
          {recentActiveOrders.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center justify-between">
                <SectionHeader
                  title={`Pesanan Aktif`}
                  pillCount={recentActiveOrders.length}
                  more="Lihat Semua"
                  navigation={navigation}
                />
              </View>
              {loading && !recentActiveOrders.length ? (
                <LoadingIndicator />
              ) : error ? (
                <ErrorMessage
                  message={error}
                  onRetry={fetchRecentActiveOrders}
                />
              ) : recentActiveOrders.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {recentActiveOrders.map((order) => (
                    <ActiveOrderCard
                      key={order.id}
                      title={order.judulPekerjaan}
                      orderNo={`#${order.id}`}
                      status={order.status}
                      eta={
                        order.requiredDate
                          ? formatRelativeTime(order.requiredDate)
                          : "-"
                      }
                      icon={getIconForOrderType(order.type)}
                      time={formatRelativeTime(order.createdAt)}
                      onPress={() =>
                        navigation.navigate("OrderDetail", {
                          orderId: order.id,
                        })
                      }
                    />
                  ))}
                </ScrollView>
              ) : (
                <EmptyState />
              )}
            </View>
          )}

          {/* Newest Orders Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <SectionHeader
                title="Semua Pesanan"
                more="Lihat Semua"
                navigation={navigation}
              />
            </View>
            {loading ? (
              <LoadingIndicator />
            ) : error ? (
              <ErrorMessage message={error} onRetry={fetchNewestOrders} />
            ) : newestOrders && newestOrders.length > 0 ? (
              newestOrders.map((order) => {
                const statusInfo = formatOrderStatus(order.status);
                return (
                  <ActivityItem
                    key={order.id}
                    title={`${order.judulPekerjaan} (${order.category})`}
                    time={formatRelativeTime(order.createdAt)}
                    status={statusInfo.text}
                    icon={getIconForOrderType(order.type)}
                    statusColor={statusInfo.color}
                    onPress={() =>
                      navigation.navigate("OrderDetail", { orderId: order.id })
                    }
                  />
                );
              })
            ) : (
              <EmptyState />
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
