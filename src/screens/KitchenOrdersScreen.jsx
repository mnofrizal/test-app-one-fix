import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useKitchenStore } from "../store/kitchenStore";
import KitchenOrderCard from "../components/KitchenOrderCard";
import { SkeletonOrderList } from "../components/SkeletonOrderCard";
import DateFilterSheet from "../components/DateFilterSheet";
import dayjs from "dayjs";

const KitchenOrdersScreen = ({ navigation }) => {
  const {
    pendingOrders,
    inProgressOrders,
    completedOrders,
    isLoading,
    fetchPendingOrders,
    fetchInProgressOrders,
    fetchCompletedOrders,
  } = useKitchenStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedDateFilter, setSelectedDateFilter] = useState(null);
  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;
  const LOAD_MORE_SIZE = 5;

  // Memoize allOrders to prevent unnecessary sorts and maps
  const allOrders = useMemo(() => {
    return [...pendingOrders, ...inProgressOrders, ...completedOrders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((order) => ({
        ...order,
        dateLabel: dayjs(order.createdAt).format("DD/MM/YYYY"),
      }));
  }, [pendingOrders, inProgressOrders, completedOrders]);

  // Memoize all filtered orders
  const allFilteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Filter by status
    if (selectedStatus !== "ALL") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Global search across all order properties
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const searchFields = [
          String(order.id || ""),
          order.category || "",
          order.judulPekerjaan || "",
          order.dropPoint || "",
          order.supervisor?.subBidang || "",
          order.status || "",
          // Search through employee orders and their items
          ...(order.employeeOrders || []).flatMap((empOrder) => [
            empOrder.employee?.name || "",
            ...(empOrder.orderItems || []).map((item) => item.name || ""),
          ]),
        ];
        return searchFields.some((field) =>
          field.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by date
    if (selectedDateFilter) {
      const today = dayjs().startOf("day");
      switch (selectedDateFilter) {
        case "today":
          filtered = filtered.filter((order) =>
            dayjs(order.createdAt).isSame(today, "day")
          );
          break;
        case "week":
          filtered = filtered.filter((order) =>
            dayjs(order.createdAt).isAfter(today.subtract(1, "week"))
          );
          break;
        case "month":
          filtered = filtered.filter((order) =>
            dayjs(order.createdAt).isAfter(today.subtract(1, "month"))
          );
          break;
      }
    }

    return filtered;
  }, [allOrders, selectedStatus, searchQuery, selectedDateFilter]);

  // Memoize paginated orders for current view
  const paginatedOrders = useMemo(() => {
    const totalItems =
      currentPage === 1
        ? PAGE_SIZE
        : PAGE_SIZE + (currentPage - 1) * LOAD_MORE_SIZE;
    return allFilteredOrders.slice(0, totalItems);
  }, [allFilteredOrders, currentPage]);

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (paginatedOrders.length < allFilteredOrders.length) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginatedOrders.length, allFilteredOrders.length]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, searchQuery, selectedDateFilter]);

  // Memoize footer component
  const ListFooter = useCallback(() => {
    if (paginatedOrders.length >= allFilteredOrders.length) return null;

    return (
      <View className="items-center py-4">
        <Text className="text-sm text-gray-500">Loading more orders...</Text>
      </View>
    );
  }, [paginatedOrders.length, allFilteredOrders.length]);

  const handleRefresh = useCallback(async () => {
    await Promise.all([
      fetchPendingOrders(),
      fetchInProgressOrders(),
      fetchCompletedOrders(),
    ]);
  }, [fetchPendingOrders, fetchInProgressOrders, fetchCompletedOrders]);

  // Memoize QuickFilter component to prevent re-renders
  const QuickFilter = useCallback(
    ({ status, label, count }) => (
      <TouchableOpacity
        onPress={() => setSelectedStatus(status)}
        className={`flex-row items-center justify-center px-4 py-2 rounded-full mr-2 ${
          selectedStatus === status ? "bg-blue-600" : "bg-gray-100"
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            selectedStatus === status ? "text-white" : "text-gray-600"
          }`}
        >
          {label}
        </Text>

        <View
          className={`ml-2 flex-row items-center justify-center rounded-full  ${
            selectedStatus === status ? "bg-white" : "bg-gray-200"
          } px-1 py-0.5`}
        >
          <Text className="text-xs font-semibold text-gray-600">{count}</Text>
        </View>
      </TouchableOpacity>
    ),
    [selectedStatus]
  );

  // Memoize renderItem for FlashList
  const renderItem = useCallback(
    ({ item: order }) => (
      <View className="px-4">
        <KitchenOrderCard
          order={order}
          onPress={() => navigation.navigate("KitchenOrderDetail", { order })}
        />
      </View>
    ),
    [navigation]
  );

  // Memoize list header to prevent re-renders
  const ListHeader = useCallback(() => {
    if (paginatedOrders.length === 0) return null;
    return (
      <View className="px-4 pb-4">
        <Text className="text-base font-medium text-gray-600">
          {paginatedOrders[0]?.dateLabel}
        </Text>
      </View>
    );
  }, [paginatedOrders]);

  // Memoize empty component
  const ListEmptyComponent = useCallback(
    () => (
      <View className="items-center justify-center py-12">
        <MaterialCommunityIcons
          name="clipboard-text-outline"
          size={48}
          color="#9CA3AF"
        />
        <Text className="mt-4 text-base text-gray-500">No orders found</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-white pt-2">
      <View className="border-b border-gray-200 px-4">
        {/* Search and Calendar Row */}
        <View className="mb-4 flex-row items-center">
          <View className="mr-3 flex-1 flex-row items-center rounded-full bg-gray-100 px-3">
            <MaterialCommunityIcons name="magnify" size={20} color="#6B7280" />
            <TextInput
              className="ml-2 flex-1 text-base"
              placeholder="Cari pesanan..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            onPress={() => setIsDateFilterVisible(true)}
            className={`rounded-full p-2.5 ${
              selectedDateFilter ? "bg-blue-600" : "bg-gray-100"
            }`}
          >
            <MaterialCommunityIcons
              name="calendar"
              size={24}
              color={selectedDateFilter ? "#fff" : "#374151"}
            />
          </TouchableOpacity>
        </View>

        {/* Status Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <QuickFilter status="ALL" label="Semua" count={allOrders.length} />
          <QuickFilter
            status="PENDING_KITCHEN"
            label="Pending"
            count={pendingOrders.length}
          />
          <QuickFilter
            status="IN_PROGRESS"
            label="Diproses"
            count={inProgressOrders.length}
          />
          <QuickFilter
            status="COMPLETED"
            label="Selesai"
            count={completedOrders.length}
          />
        </ScrollView>
      </View>

      {/* Order List with FlashList */}
      <View className="flex-1 bg-gray-50">
        {isLoading ? (
          <SkeletonOrderList />
        ) : (
          <FlashList
            data={paginatedOrders}
            renderItem={renderItem}
            estimatedItemSize={100}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={ListEmptyComponent}
            ListFooterComponent={ListFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={handleRefresh}
              />
            }
            contentContainerStyle={{ paddingVertical: 16 }}
          />
        )}
      </View>

      <DateFilterSheet
        visible={isDateFilterVisible}
        onClose={() => setIsDateFilterVisible(false)}
        onSelect={(value) => setSelectedDateFilter(value)}
        selectedFilter={selectedDateFilter}
      />
    </SafeAreaView>
  );
};

export default React.memo(KitchenOrdersScreen);
