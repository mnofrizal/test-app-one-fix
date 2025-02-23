import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import BottomSheet from "../components/BottomSheet";
import { SkeletonOrderList } from "../components/SkeletonOrderCard";
import { useSecretaryStore } from "../store/secretaryStore";
import { useAdminStore } from "../store/adminStore";
import { useAuthStore } from "../store/authStore";
import { StatusBar } from "expo-status-bar";

const OrderCard = React.memo(
  ({ type, category, title, date, time, status, details, subBidang }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "COMPLETED":
          return {
            bg: "bg-green-50",
            text: "text-green-700",
            icon: "check-circle",
            label: "SELESAI",
          };
        case "PENDING_SUPERVISOR":
          return {
            bg: "bg-yellow-50",
            text: "text-yellow-700",
            icon: "clock-outline",
            label: "ASMAN",
          };
        case "PENDING_GA":
          return {
            bg: "bg-orange-50",
            text: "text-orange-700",
            icon: "clock-outline",
            label: "ADMIN",
          };
        case "PENDING_KITCHEN":
          return {
            bg: "bg-purple-50",
            text: "text-purple-700",
            icon: "clock-outline",
            label: "KITCHEN",
          };
        case "IN_PROGRESS":
          return {
            bg: "bg-blue-50",
            text: "text-blue-700",
            icon: "progress-clock",
            label: "PROSES",
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
      // Normalize type to uppercase for consistency with backend
      const normalizedType = type?.toUpperCase();
      switch (normalizedType) {
        case "MEAL":
          return {
            icon: "food",
            color: "#FFD07A",
            bg: "bg-orange-50",
            lightBg: "bg-orange-50/50",
          };
        case "TRANSPORT":
          return {
            icon: "car",
            color: "#00AACC",
            bg: "bg-blue-50",
            lightBg: "bg-blue-50/50",
          };
        case "ROOM":
          return {
            icon: "door",
            color: "#FF0000",
            bg: "bg-red-50",
            lightBg: "bg-red-50/50",
          };
        case "STATIONARY":
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

    const serviceInfo = useMemo(() => getServiceInfo(type), [type]);
    const statusInfo = useMemo(() => getStatusColor(status), [status]);

    return (
      <Animated.View
        entering={FadeIn}
        layout={Layout}
        className="mb-4 overflow-hidden rounded-2xl border-2 border-gray-100 bg-white"
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
              <View className={`mr-4 rounded-xl ${serviceInfo.bg} `}>
                <MaterialCommunityIcons
                  name={serviceInfo.icon}
                  size={20}
                  color={serviceInfo.color}
                />
              </View>
              <View className="flex-1">
                <View className="flex-row flex-wrap items-center justify-between">
                  <View className="flex-shrink">
                    <Text className="mr-2 text-base font-semibold text-gray-900">
                      {title}
                    </Text>
                  </View>
                </View>
                <Text className="text-xs font-medium text-gray-500">
                  {time} -{" "}
                  <Text className={`text-xs font-semibold ${statusInfo.text}`}>
                    {category}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {details?.assignee && (
          <View className="border-gray-200 bg-white px-5 py-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="h-8 w-8 flex-row items-center justify-center rounded-full bg-gray-200">
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color="#9CA3AF"
                  />
                </View>
                <View className="ml-3">
                  <Text className="text-sm font-medium text-gray-900">
                    {details.assignee}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {subBidang.length > 20
                      ? `${subBidang.substring(0, 30)}...`
                      : subBidang}
                  </Text>
                </View>
              </View>
              <View className={`rounded-full ${statusInfo.bg} px-3 py-1`}>
                <Text className={`text-xs font-semibold ${statusInfo.text}`}>
                  {statusInfo.label}
                </Text>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    );
  }
);

const FilterButton = React.memo(({ label, icon, isSelected, onPress }) => (
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
));

const DateLabel = React.memo(({ date }) => (
  <View className="mb-4 mt-2">
    <Text className="text-base font-semibold text-gray-900">{date}</Text>
  </View>
));

const DateFilterSheet = React.memo(
  ({ visible, onClose, selectedDate, onSelect, dateGroups, onReset }) => {
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
                    if (filter.value === "all") {
                      onSelect(null);
                      onReset?.();
                    } else {
                      onSelect(filter.value);
                    }
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
                    color={
                      selectedDate === filter.value ? "#ffffff" : "#374151"
                    }
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
  }
);

const dateFilterGroups = [
  {
    title: "Quick Filters",
    filters: [
      { label: "Clear Dates", value: "all", icon: "calendar-remove" },
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

const OrdersList = React.memo(({ orders, searchQuery }) => {
  const navigation = useNavigation();
  // Filter orders by search query
  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        searchQuery
          ? order.judulPekerjaan
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          : true
      ),
    [orders, searchQuery]
  );

  // Group filtered orders by date
  const groupedOrders = useMemo(() => {
    return filteredOrders.reduce((groups, order) => {
      const date = new Date(order.requestDate).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(order);
      return groups;
    }, {});
  }, [filteredOrders]);

  if (Object.entries(groupedOrders).length === 0) {
    return (
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
    );
  }

  return (
    <View className="p-4 py-2">
      {Object.entries(groupedOrders).map(([date, orders]) => (
        <View key={date}>
          <DateLabel date={date} />
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigation.navigate("OrderDetail", { order })}
            >
              <OrderCard
                type={order.type}
                category={order.category}
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
                subBidang={order.supervisor?.subBidang}
              />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
});

const OrderTab = React.memo(
  ({ orders, searchQuery, refreshing, onRefresh }) => {
    return (
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
            colors={["#4F46E5"]}
          />
        }
      >
        <OrdersList orders={orders} searchQuery={searchQuery} />
      </ScrollView>
    );
  }
);

const OrderScreen = () => {
  const navigation = useNavigation();
  const layout = useMemo(() => Dimensions.get("window"), []);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "approval", title: "Approval" },
    { key: "inprogress", title: "In Progress" },
    { key: "done", title: "Done" },
  ]);
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

  const [refreshing, setRefreshing] = useState(false);

  // Handle refresh - only fetch new data on pull-to-refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchOrders(1);
    setRefreshing(false);
  }, [fetchOrders]);

  // Fetch orders only on mount
  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  // Filter orders locally based on selected filters
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Type filter
      if (
        selectedTypes.length > 0 &&
        !selectedTypes.includes(order.type.toLowerCase())
      ) {
        return false;
      }

      // Date filter
      if (selectedDate) {
        const orderDate = new Date(order.requestDate);
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));

        switch (selectedDate) {
          case "today":
            return orderDate >= today;
          case "week":
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case "month":
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          case "last7":
            const last7Days = new Date(now);
            last7Days.setDate(last7Days.getDate() - 7);
            return orderDate >= last7Days;
          case "last30":
            const last30Days = new Date(now);
            last30Days.setDate(last30Days.getDate() - 30);
            return orderDate >= last30Days;
          case "last90":
            const last90Days = new Date(now);
            last90Days.setDate(last90Days.getDate() - 90);
            return orderDate >= last90Days;
          default:
            return true;
        }
      }

      return true;
    });
  }, [orders, selectedTypes, selectedDate]);

  // Map filtered orders based on status
  const mappedOrders = useMemo(
    () => ({
      approval: filteredOrders.filter(
        (order) =>
          order.status === "PENDING_SUPERVISOR" || order.status === "PENDING_GA"
      ),
      inprogress: filteredOrders.filter(
        (order) =>
          order.status === "PENDING_KITCHEN" || order.status === "IN_PROGRESS"
      ),
      done: filteredOrders.filter(
        (order) => order.status === "COMPLETED" || order.status === "CANCELLED"
      ),
    }),
    [filteredOrders]
  );

  const renderScene = React.useCallback(
    ({ route }) => {
      if (loading) return <SkeletonOrderList />;
      if (error) {
        return (
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
        );
      }

      return (
        <OrderTab
          orders={mappedOrders[route.key]}
          searchQuery={searchQuery}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      );
    },
    [loading, error, mappedOrders, searchQuery, refreshing, onRefresh]
  );

  const filterTypes = [
    { label: "Meal", icon: "food", value: "meal" },
    { label: "Transport", icon: "car", value: "transport" },
    { label: "Room", icon: "door", value: "room" },
    { label: "Stationary", icon: "pencil", value: "stationary" },
  ];
  const renderTabBar = React.useCallback(
    (props) => (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: "#4F46E5" }}
        style={{ backgroundColor: "white" }}
        labelStyle={{ color: "#374151", fontWeight: "500" }}
        activeColor="#4F46E5"
        inactiveColor="#6B7280"
        renderLabel={({ route, focused, color }) => (
          <View className="flex-row items-center py-3">
            <Text style={{ color }} className="text-sm font-medium">
              {route.title}
            </Text>
            {route.key === "approval" && mappedOrders.approval.length > 0 && (
              <View className="ml-2 rounded-full bg-gray-100 px-2 py-0.5">
                <Text className="text-xs font-medium text-gray-600">
                  {mappedOrders.approval.length}
                </Text>
              </View>
            )}
            {route.key === "inprogress" &&
              mappedOrders.inprogress.length > 0 && (
                <View className="ml-2 rounded-full bg-gray-100 px-2 py-0.5">
                  <Text className="text-xs font-medium text-gray-600">
                    {mappedOrders.inprogress.length}
                  </Text>
                </View>
              )}
            {route.key === "done" && mappedOrders.done.length > 0 && (
              <View className="ml-2 rounded-full bg-gray-100 px-2 py-0.5">
                <Text className="text-xs font-medium text-gray-600">
                  {mappedOrders.done.length}
                </Text>
              </View>
            )}
          </View>
        )}
      />
    ),
    [mappedOrders]
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Search Bar and Add Button */}
      <View className="bg-white px-4 pb-2 pt-10">
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

      {/* Filter Buttons */}
      <View className="flex-row bg-white pt-4">
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

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ flex: 1, backgroundColor: "white" }}
      />

      <DateFilterSheet
        visible={dateFilterVisible}
        onClose={() => setDateFilterVisible(false)}
        selectedDate={selectedDate}
        onSelect={setSelectedDate}
        dateGroups={dateFilterGroups}
        onReset={resetFilters}
      />
    </View>
  );
};

export default OrderScreen;
