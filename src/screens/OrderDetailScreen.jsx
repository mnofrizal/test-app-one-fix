import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSecretaryStore } from "../store/secretaryStore";
import { useAdminStore } from "../store/adminStore";
import { useAuthStore } from "../store/authStore";

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getStatusBgColor = (color) => {
  switch (color) {
    case "yellow":
      return "bg-yellow-50";
    case "orange":
      return "bg-orange-50";
    case "purple":
      return "bg-purple-50";
    case "blue":
      return "bg-blue-50";
    case "green":
      return "bg-green-50";
    case "red":
      return "bg-red-50";
    default:
      return "bg-gray-50";
  }
};

const getStatusTextColor = (color) => {
  switch (color) {
    case "yellow":
      return "text-yellow-700";
    case "orange":
      return "text-orange-700";
    case "purple":
      return "text-purple-700";
    case "blue":
      return "text-blue-700";
    case "green":
      return "text-green-700";
    case "red":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
};

const DetailTab = ({ order }) => {
  if (!order) return null;

  const status = formatOrderStatus(order.status);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Status Section */}
      <View className="bg-white py-4">
        <View className="px-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Status Pesanan
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View
                className={`mr-3 h-10 w-10 items-center justify-center rounded-full ${getStatusBgColor(
                  status.color
                )}`}
              >
                <MaterialCommunityIcons
                  name={
                    status.color === "green"
                      ? "check-circle"
                      : status.color === "red"
                      ? "close-circle"
                      : "clock-outline"
                  }
                  size={24}
                  color={getStatusTextColor(status.color).replace("text-", "")}
                />
              </View>
              <View>
                <Text
                  className={`text-sm font-semibold ${getStatusTextColor(
                    status.color
                  )}`}
                >
                  {status.text}
                </Text>
                <Text className="text-xs text-gray-500">
                  Last updated: {formatTime(order.updatedAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-2 bg-white">
        <View className="border-b border-gray-100 px-4 py-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Informasi Drop Point
          </Text>
          <Text className="text-base font-semibold text-gray-900">
            {order.dropPoint}
          </Text>
          <View className="mt-1 flex-row items-center">
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="#6B7280"
            />
            <Text className="ml-1 text-sm text-gray-500">{order.category}</Text>
          </View>
        </View>

        <View className="border-b border-gray-100 px-4 py-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            PIC
          </Text>
          <Text className="text-base font-semibold text-gray-900">
            {order.pic.name}
          </Text>
          <View className="mt-1 flex-row items-center">
            <MaterialCommunityIcons name="phone" size={16} color="#6B7280" />
            <Text className="ml-1 text-sm text-gray-500">
              {order.pic.nomorHp}
            </Text>
          </View>
        </View>
        <View className="border-b border-gray-100 px-4 py-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            ASMAN
          </Text>
          <Text className="text-base font-semibold text-gray-900">
            {order.supervisor.name}
          </Text>
          <Text className="text-sm text-gray-500">
            {order.supervisor.subBidang}
          </Text>
          <View className="mt-1 flex-row items-center">
            <MaterialCommunityIcons name="phone" size={16} color="#6B7280" />
            <Text className="ml-1 text-sm text-gray-500">
              {order.supervisor.nomorHp}
            </Text>
          </View>
        </View>

        <View className="px-4 py-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Waktu
          </Text>
          <View className="flex-row justify-between">
            <View className="flex-1">
              <Text className="text-sm text-gray-500">Request</Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatDate(order.requestDate)}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatTime(order.requestDate)} WIB
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-500">Dibutuhkan</Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatDate(order.requiredDate)}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatTime(order.requiredDate)} WIB
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const MenuTab = ({ order }) => {
  if (!order) return null;

  // Calculate total items
  const totalItems = order.employeeOrders.reduce(
    (acc, emp) =>
      acc + emp.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Summary Section */}
      <View className="bg-white px-4 py-3">
        <Text className="text-xs font-medium text-gray-500">Total Pesanan</Text>
        <Text className="text-lg font-bold text-gray-900">
          {totalItems} items
        </Text>
      </View>

      {/* Menu List */}
      <View className="mt-2">
        {order.employeeOrders.map((employee, index) => (
          <View
            key={employee.id}
            className={`bg-white ${
              index !== order.employeeOrders.length - 1 ? "mb-2" : ""
            }`}
          >
            <View className="border-b border-gray-100 px-4 py-3">
              <View className="flex-row items-center">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <MaterialCommunityIcons
                    name="account"
                    size={20}
                    color="#4F46E5"
                  />
                </View>
                <View className="ml-3">
                  <Text className="text-sm font-semibold text-gray-900">
                    {employee.employeeName}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {employee.entity}
                  </Text>
                </View>
              </View>
            </View>

            {employee.orderItems.map((item) => (
              <View
                key={item.id}
                className="border-b border-gray-100 px-4 py-3"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-medium text-gray-900">
                      {item.menuItem.name}
                    </Text>
                    {item.notes && (
                      <Text className="mt-1 text-sm text-gray-500">
                        {item.notes}
                      </Text>
                    )}
                  </View>
                  <View className="ml-4 items-end">
                    <View className="rounded-full bg-indigo-50 px-3 py-1">
                      <Text className="text-sm font-medium text-indigo-700">
                        x{item.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const ApprovalTab = ({ order }) => {
  if (!order) return null;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="bg-white py-3">
        <View className="px-4">
          <Text className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Approval Chain
          </Text>
        </View>
      </View>

      <View className="mt-2">
        {order.approvalLinks.map((approval, index) => {
          const status = approval.isUsed
            ? approval.response
              ? { text: "Approved", color: "green" }
              : { text: "Rejected", color: "red" }
            : { text: "Pending", color: "yellow" };

          return (
            <View
              key={approval.id}
              className={`bg-white ${
                index !== order.approvalLinks.length - 1 ? "mb-2" : ""
              }`}
            >
              <View className="flex-row items-start border-l-4 border-indigo-500 px-4 py-4">
                <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                  <MaterialCommunityIcons
                    name={
                      status.color === "green"
                        ? "check-circle"
                        : status.color === "red"
                        ? "close-circle"
                        : "clock-outline"
                    }
                    size={28}
                    color="#4F46E5"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-base font-semibold text-gray-900">
                        {approval.type}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {approval.respondedAt
                          ? `Responded ${formatDate(approval.respondedAt)}`
                          : "Waiting for response"}
                      </Text>
                    </View>
                    <View
                      className={`rounded-full ${getStatusBgColor(
                        status.color
                      )} px-3 py-1`}
                    >
                      <Text
                        className={`text-xs font-medium ${getStatusTextColor(
                          status.color
                        )}`}
                      >
                        {status.text}
                      </Text>
                    </View>
                  </View>
                  {approval.responseNote && (
                    <View className="mt-2 rounded-lg bg-gray-50 p-3">
                      <Text className="text-sm text-gray-700">
                        {approval.responseNote}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const LoadingView = () => (
  <View className="flex-1 items-center justify-center bg-gray-50">
    <ActivityIndicator size="large" color="#4F46E5" />
    <Text className="mt-2 text-sm text-gray-600">Loading order details...</Text>
  </View>
);

const OrderDetailScreen = ({ route }) => {
  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "detail", title: "Detail" },
    { key: "menu", title: "Menu" },
    { key: "approval", title: "Approval" },
  ]);

  const { user } = useAuthStore();
  const secretaryStore = useSecretaryStore();
  const adminStore = useAdminStore();

  // Use appropriate store based on user role
  const store = user?.role === "ADMIN" ? adminStore : secretaryStore;
  const { selectedOrder, fetchOrderDetails, loading } = store;
  const orderId = route.params?.orderId;

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId, fetchOrderDetails]);

  if (loading) return <LoadingView />;
  if (!selectedOrder) return null;

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "detail":
        return <DetailTab order={selectedOrder} />;
      case "menu":
        return <MenuTab order={selectedOrder} />;
      case "approval":
        return <ApprovalTab order={selectedOrder} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#4F46E5" }}
      style={{ backgroundColor: "white" }}
      labelStyle={{ color: "#374151", fontWeight: "500" }}
      activeColor="#4F46E5"
      inactiveColor="#6B7280"
    />
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-blue-800 px-4 pb-6 pt-14 shadow-sm">
        <View className="mb-2 flex-row items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
            <MaterialCommunityIcons
              name={getIconForOrderType(selectedOrder.type)}
              size={35}
              color="#4F46E5"
            />
          </View>
          <View className="ml-3">
            <Text className="text-xl text-white">#{selectedOrder.id}</Text>
            <Text className="text-2xl font-bold text-white">
              {selectedOrder.judulPekerjaan}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
};

export default OrderDetailScreen;
