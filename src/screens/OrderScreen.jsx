import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import BottomSheet from "../components/BottomSheet";
import { useSecretaryStore } from "../store/secretaryStore";
import { useAdminStore } from "../store/adminStore";
import { useAuthStore } from "../store/authStore";
import { StatusBar } from "expo-status-bar";

const OrderCard = ({ type, title, date, time, status, details }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          icon: "check-circle",
          label: "Completed",
        };
      case "PENDING_SUPERVISOR":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          icon: "clock-outline",
          label: "Pending ASMAN",
        };
      case "PENDING_GA":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          icon: "clock-outline",
          label: "Pending GA",
        };
      case "PENDING_KITCHEN":
      case "IN_PROGRESS":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          icon: "progress-clock",
          label: "In Progress",
        };
      case "CANCELLED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          icon: "close-circle",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          icon: "information",
          label: status,
        };
    }
  };

  const getServiceInfo = (type) => {
    switch (type?.toLowerCase()) {
      case "meal":
        return {
          icon: "food",
          color: "#FFD07A",
          bg: "bg-orange-50",
          lightBg: "bg-orange-50/50",
        };
      case "transport":
        return {
          icon: "car",
          color: "#00AACC",
          bg: "bg-blue-50",
          lightBg: "bg-blue-50/50",
        };
      case "room":
        return {
          icon: "door",
          color: "#FF0000",
          bg: "bg-red-50",
          lightBg: "bg-red-50/50",
        };
      case "stationary":
        return {
          icon: "pencil",
          color: "#00A0A0",
          bg: "bg-teal-50",
          lightBg: "bg-teal-50/50",
        };
      default:
        return {
          icon: "package",
          color: "#4F46E5",
          bg: "bg-indigo-50",
          lightBg: "bg-indigo-50/50",
        };
    }
  };

  const serviceInfo = getServiceInfo(type);
  const statusInfo = getStatusColor(status);

  return (
    <Animated.View
      entering={FadeIn}
      layout={Layout}
      className="mb-4 overflow-hidden rounded-2xl border-2 border-gray-100 bg-white shadow-lg"
    >
      <View
        className={`relative px-5 py-4 ${serviceInfo.lightBg} shadow-sm`}
        style={{
          borderLeftWidth: 4,
          borderLeftColor: serviceInfo.color,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className={`mr-3 rounded-xl ${serviceInfo.bg} p-3`}>
              <MaterialCommunityIcons
                name={serviceInfo.icon}
                size={24}
                color={serviceInfo.color}
              />
            </View>
            <View className="flex-1">
              <View className="flex-row flex-wrap items-center justify-between">
                <View className="max-w-[70%] flex-shrink">
                  <Text className="mr-2 text-lg font-semibold text-gray-900">
                    {title.length > 10 ? `${title.substring(0, 12)}...` : title}
                  </Text>
                </View>
                <View className={`rounded-full ${statusInfo.bg} px-3 py-1`}>
                  <Text className={`text-xs font-semibold ${statusInfo.text}`}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>
              <Text className="text-sm font-medium text-gray-500">{time}</Text>
            </View>
          </View>
        </View>
      </View>

      {details?.assignee && (
        <View className="border-gray-200 bg-white px-5 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="h-8 w-8 rounded-full bg-gray-200">
                <MaterialCommunityIcons
                  name="account"
                  size={32}
                  color="#9CA3AF"
                />
              </View>
              <View className="ml-3">
                <Text className="text-sm font-medium text-gray-900">
                  {details.assignee}
                </Text>
                <Text className="text-xs text-gray-500">Assigned Staff</Text>
              </View>
            </View>
            <TouchableOpacity className="rounded-full bg-indigo-50 p-2">
              <MaterialCommunityIcons
                name="chat-outline"
                size={20}
                color="#4F46E5"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const TabBar = ({ tabs, activeTab, onTabChange }) => (
  <View className="flex-row border-b border-gray-200">
    {tabs.map((tab) => (
      <TouchableOpacity
        key={tab.key}
        onPress={() => onTabChange(tab.key)}
        className={`flex-1 border-b-2 px-4 py-4 ${
          activeTab === tab.key ? "border-blue-600" : "border-transparent"
        }`}
      >
        <View className="flex-row items-center justify-center">
          <Text
            className={`text-sm font-medium ${
              activeTab === tab.key ? "text-blue-600" : "text-gray-500"
            }`}
          >
            {tab.label}
          </Text>
          {tab.count > 0 && (
            <View className="ml-2 rounded-full bg-gray-100 px-2 py-0.5">
              <Text
                className={`text-xs font-medium ${
                  activeTab === tab.key ? "text-blue-800" : "text-gray-600"
                }`}
              >
                {tab.count}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ))}
  </View>
);

const FilterButton = ({ label, icon, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`mr-2 flex-row items-center rounded-full px-4 py-2 ${
      isSelected ? "bg-blue-800" : "bg-white border border-gray-200"
    }`}
  >
    <MaterialCommunityIcons
      name={icon}
      size={18}
      color={isSelected ? "#ffffff" : "#374151"}
    />
    {label && (
      <Text
        className={`ml-2 text-sm font-medium ${
          isSelected ? "text-white" : "text-gray-700"
        }`}
      >
        {label}
      </Text>
    )}
  </TouchableOpacity>
);

const DateLabel = ({ date }) => (
  <View className="mb-4 mt-2">
    <Text className="text-base font-semibold text-gray-900">{date}</Text>
  </View>
);

const DateFilterSheet = ({
  visible,
  onClose,
  selectedDate,
  onSelect,
  dateGroups,
}) => {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%"]}
      enablePanDownToClose
    >
      <View className="flex-1 px-6">
        <View className="mb-6 border-b border-gray-100 pb-4">
          <Text className="text-xl font-bold text-gray-900">
            Filter by Date
          </Text>
          <Text className="text-base text-gray-500">
            Select a date range to filter orders
          </Text>
        </View>

        {dateGroups.map((group) => (
          <View key={group.title} className="mb-6">
            <Text className="mb-3 text-sm font-medium text-gray-500">
              {group.title}
            </Text>
            {group.filters.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                onPress={() => {
                  onSelect(filter.value === "all" ? null : filter.value);
                  onClose();
                }}
                className={`mb-2 flex-row items-center rounded-full px-4 py-2 ${
                  selectedDate === filter.value
                    ? "bg-gray-900"
                    : "bg-white border border-gray-200"
                }`}
              >
                <MaterialCommunityIcons
                  name={filter.icon}
                  size={18}
                  color={selectedDate === filter.value ? "#ffffff" : "#374151"}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    selectedDate === filter.value
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </BottomSheet>
  );
};

const dateFilterGroups = [
  {
    title: "Quick Filters",
    filters: [
      { label: "All Dates", value: "all", icon: "calendar" },
      { label: "Today", value: "today", icon: "calendar-today" },
      { label: "This Week", value: "week", icon: "calendar-week" },
      { label: "This Month", value: "month", icon: "calendar-month" },
    ],
  },
  {
    title: "Custom Range",
    filters: [
      { label: "Last 7 Days", value: "last7", icon: "calendar-range" },
      { label: "Last 30 Days", value: "last30", icon: "calendar-range" },
      { label: "Last 90 Days", value: "last90", icon: "calendar-range" },
    ],
  },
];

const OrderScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("approval");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilterVisible, setDateFilterVisible] = useState(false);

  const { user } = useAuthStore();
  const secretaryStore = useSecretaryStore();
  const adminStore = useAdminStore();

  // Use appropriate store based on user role
  const store = user?.role === "ADMIN" ? adminStore : secretaryStore;

  const {
    orders,
    loading,
    error,
    filters,
    setFilters,
    resetFilters,
    fetchOrders,
    totalOrders,
  } = store;

  // Fetch orders on mount and when filters change
  useEffect(() => {
    const dateFilter = selectedDate
      ? {
          startDate: (() => {
            const now = new Date();
            switch (selectedDate) {
              case "today":
                return new Date(now.setHours(0, 0, 0, 0)).toISOString();
              case "week":
                now.setDate(now.getDate() - 7);
                return now.toISOString();
              case "month":
                now.setMonth(now.getMonth() - 1);
                return now.toISOString();
              case "last7":
                now.setDate(now.getDate() - 7);
                return now.toISOString();
              case "last30":
                now.setDate(now.getDate() - 30);
                return now.toISOString();
              case "last90":
                now.setDate(now.getDate() - 90);
                return now.toISOString();
              default:
                return null;
            }
          })(),
          endDate: new Date().toISOString(),
        }
      : {};

    setFilters({
      ...dateFilter,
      type: selectedTypes.length > 0 ? selectedTypes[0].toUpperCase() : null,
    });

    fetchOrders(1);
  }, [selectedTypes, selectedDate, activeTab]);

  // Map orders based on status
  const mappedOrders = {
    approval: orders.filter(
      (order) =>
        order.status === "PENDING_SUPERVISOR" || order.status === "PENDING_GA"
    ),
    inprogress: orders.filter(
      (order) =>
        order.status === "PENDING_KITCHEN" || order.status === "IN_PROGRESS"
    ),
    done: orders.filter(
      (order) => order.status === "COMPLETED" || order.status === "CANCELLED"
    ),
  };

  const tabs = [
    { label: "Approval", key: "approval", count: mappedOrders.approval.length },
    {
      label: "In Progress",
      key: "inprogress",
      count: mappedOrders.inprogress.length,
    },
    { label: "Done", key: "done", count: mappedOrders.done.length },
  ];

  const filterTypes = [
    { label: "Meal", icon: "food", value: "meal" },
    { label: "Transport", icon: "car", value: "transport" },
    { label: "Room", icon: "door", value: "room" },
    { label: "Stationary", icon: "pencil", value: "stationary" },
  ];

  // Filter orders by search
  const filteredOrders = mappedOrders[activeTab].filter((order) => {
    const matchesSearch = searchQuery
      ? order.judulPekerjaan.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  // Group orders by date
  const groupedOrders = filteredOrders.reduce((groups, order) => {
    const date = new Date(order.requestDate).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(order);
    return groups;
  }, {});

  return (
    <View className="flex-1 bg-gray-50 pt-3">
      {/* <StatusBar barStyle="light-content" bakgroundColor="#1E40AF" /> */}
      <View className="bg-white shadow-sm">
        <View className="px-4 pb-2 pt-10">
          <View className="flex-row items-center justify-center space-x-3">
            <View className="flex-1 overflow-hidden rounded-full border border-gray-200 bg-white">
              <View className="flex-row items-center px-4">
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  placeholder="Search orders..."
                  className="flex-1 py-2 pl-2 text-base"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                  autoCorrect={false}
                  blurOnSubmit={false}
                  autoCapitalize="none"
                />
                {searchQuery ? (
                  <TouchableOpacity
                    onPress={() => setSearchQuery("")}
                    className="rounded-full p-1"
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              className="rounded-full bg-blue-900 p-2"
              onPress={() => navigation.navigate("MealOrder")}
            >
              <MaterialCommunityIcons name="plus" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </View>

      <ScrollView className="flex-1">
        <View className="flex-row pt-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-6"
          >
            {filterTypes.map((type) => (
              <FilterButton
                key={type.value}
                label={type.label}
                icon={type.icon}
                isSelected={selectedTypes.includes(type.value)}
                onPress={() => {
                  setSelectedTypes((prevTypes) =>
                    prevTypes.includes(type.value)
                      ? prevTypes.filter((t) => t !== type.value)
                      : [...prevTypes, type.value]
                  );
                }}
              />
            ))}
          </ScrollView>
          <View className="px-2">
            <FilterButton
              icon="calendar"
              isSelected={selectedDate !== null}
              onPress={() => setDateFilterVisible(true)}
            />
          </View>
        </View>

        <View className="p-4 py-2">
          {loading ? (
            <View className="mt-4 items-center">
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text className="mt-2 text-base font-medium text-gray-500">
                Loading orders...
              </Text>
            </View>
          ) : error ? (
            <View className="mt-4 items-center">
              <MaterialCommunityIcons
                name="alert-circle"
                size={48}
                color="#EF4444"
              />
              <Text className="mt-2 text-base font-medium text-red-500">
                {error}
              </Text>
            </View>
          ) : Object.entries(groupedOrders).length > 0 ? (
            Object.entries(groupedOrders).map(([date, orders]) => (
              <View key={date}>
                <DateLabel date={date} />
                {orders.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    onPress={() =>
                      navigation.navigate("OrderDetail", { orderId: order.id })
                    }
                  >
                    <OrderCard
                      type={order.type}
                      title={order.judulPekerjaan}
                      date={new Date(order.requestDate).toLocaleDateString()}
                      time={new Date(order.requestDate).toLocaleTimeString()}
                      status={order.status}
                      details={{
                        assignee: order.pic?.name,
                        time: `Required by: ${new Date(
                          order.requiredDate
                        ).toLocaleString()}`,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))
          ) : (
            <View className="mt-4 items-center">
              <MaterialCommunityIcons
                name="clipboard-text-search"
                size={48}
                color="#9CA3AF"
              />
              <Text className="mt-2 text-base font-medium text-gray-500">
                No orders found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <DateFilterSheet
        visible={dateFilterVisible}
        onClose={() => setDateFilterVisible(false)}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        dateGroups={dateFilterGroups}
      />
    </View>
  );
};

export default OrderScreen;
