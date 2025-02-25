import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from "react-native";
import RejectReasonSheet from "../components/RejectReasonSheet";
import { TabView, TabBar } from "react-native-tab-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { SkeletonOrderDetail } from "../components/SkeletonOrderDetail";
import { deleteOrder, respondToRequest } from "../services/orderService";
import { useSecretaryStore } from "../store/secretaryStore";
import { useAdminStore } from "../store/adminStore";
import { useAuthStore } from "../store/authStore";
import { API_URL, BASE_URL } from "../config/api";

const handleDelete = (
  orderId,
  navigation,
  adminStore,
  secretaryStore,
  setIsLoading
) => {
  Alert.alert("Delete Order", "Are you sure you want to delete this order?", [
    {
      text: "Cancel",
      style: "cancel",
    },
    {
      text: "Delete",
      onPress: async () => {
        setIsLoading(true);
        try {
          await deleteOrder(orderId);
          // Refresh orders in both stores to update all screens
          // Refresh all necessary data in the store
          await Promise.all([
            adminStore.fetchOrders(),
            adminStore.fetchRecentActiveOrders(),
            adminStore.fetchRecentActivities(),
            adminStore.fetchStatusStats(),
            adminStore.fetchNewestOrders(),
          ]);
          Alert.alert("Success", "Order deleted successfully");
          navigation.goBack();
        } catch (error) {
          Alert.alert("Error", error.message || "Failed to delete order");
        } finally {
          setIsLoading(false);
        }
      },
      style: "destructive",
    },
  ]);
};

const formatOrderStatus = (status) => {
  switch (status) {
    case "PENDING_SUPERVISOR":
      return { text: "ASMAN", color: "yellow" };
    case "REJECTED_SUPERVISOR":
      return { text: "REJECTED ASMAN", color: "red" };
    case "PENDING_GA":
      return { text: "ADMIN", color: "orange" };
    case "REJECTED_GA":
      return { text: "REJECTED ADMIN", color: "red" };
    case "PENDING_KITCHEN":
      return { text: "KITCHEN", color: "purple" };
    case "REJECTED_KITCHEN":
      return { text: "REJECTED KITCHEN", color: "red" };
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

const DetailTab = ({ order, onRefresh, refreshing }) => {
  if (!order) return null;

  console.log({ order });

  const status = formatOrderStatus(order.status);

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
          colors={["#4F46E5"]}
        />
      }
    >
      {/* Status Section */}
      <View className="bg-white py-4">
        <View className="px-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Status Pesanan
          </Text>
          <View
            className={`flex-row items-center justify-between rounded-lg   ${getStatusBgColor(
              status.color
            )} p-4`}
          >
            <View className="flex-row items-center">
              <View>
                <Text
                  className={`text-xl font-semibold ${getStatusTextColor(
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
            <View className={`items-center justify-center rounded-full`}>
              <MaterialCommunityIcons
                name={
                  status.color === "green"
                    ? "check-circle"
                    : status.color === "red"
                    ? "close-circle"
                    : "clock-outline"
                }
                size={36}
                color={status.color}
              />
            </View>
          </View>
        </View>
      </View>

      <View className="mt-2 bg-white">
        <View className="border-b border-gray-100 px-4 py-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Informasi Pesanan
          </Text>
          <Text className="text-base font-semibold text-gray-900">
            {order.category}
          </Text>
          <View className="mt-1 flex-row items-center"></View>
        </View>
        <View className="border-b border-gray-100 px-4 py-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Informasi Sub Bidang
          </Text>
          <Text className="text-base font-semibold text-gray-900">
            {order.supervisor.subBidang}
          </Text>
        </View>
        <View className="border-b border-gray-100 px-4 py-4">
          <Text className="mb-3 text-sm font-medium uppercase tracking-wider text-gray-500">
            Informasi Drop Point
          </Text>
          <Text className="text-base font-semibold text-gray-900">
            {order.dropPoint}
          </Text>
        </View>

        <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-4">
          <View>
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
          <View>
            <TouchableOpacity
              onPress={() => {
                const phoneNumber = order.pic.nomorHp.replace(/\D/g, "");
                Linking.openURL(`whatsapp://send?phone=+62${phoneNumber}`);
              }}
              className={`mr-3 h-14 w-14 items-center justify-center rounded-full p-1`}
            >
              <MaterialCommunityIcons
                name="whatsapp"
                size={38}
                color={"#22C55E"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-row items-center justify-between border-b border-gray-100 px-4 py-4">
          <View>
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

          <View>
            <TouchableOpacity
              onPress={() => {
                const phoneNumber = order.supervisor.nomorHp.replace(/\D/g, "");
                Linking.openURL(`whatsapp://send?phone=+62${phoneNumber}`);
              }}
              className={`mr-3 h-14 w-14 items-center justify-center rounded-full p-1`}
            >
              <MaterialCommunityIcons
                name="whatsapp"
                size={38}
                color={"#22C55E"}
              />
            </TouchableOpacity>
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
            {/* <View className="flex-1">
              <Text className="text-sm text-gray-500">Dibutuhkan</Text>
              <Text className="text-base font-semibold text-gray-900">
                {formatDate(order.requiredDate)}
              </Text>
              <Text className="text-sm text-gray-500">
                {formatTime(order.requiredDate)} WIB
              </Text>
            </View> */}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const MenuTab = ({ order, onRefresh, refreshing }) => {
  if (!order) return null;

  // Calculate total items
  const totalItems = order.employeeOrders.reduce(
    (acc, emp) =>
      acc + emp.orderItems.reduce((sum, item) => sum + item.quantity, 0),
    0
  );

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
          colors={["#4F46E5"]}
        />
      }
    >
      {/* Summary Section */}
      <View className="bg-white px-4 pt-3">
        <Text className="text-sm font-medium text-gray-500">Total Pesanan</Text>
        <Text className="py-4 text-2xl font-bold text-gray-900">
          {totalItems} Porsi
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

const ApprovalTab = ({
  order,
  onRefresh,
  refreshing,
  setModalVisible,
  setSelectedImage,
}) => {
  if (!order) return null;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#4F46E5"
          colors={["#4F46E5"]}
        />
      }
    >
      <View className="bg-white py-3">
        <View className="px-4">
          <Text className="text-sm font-medium uppercase tracking-wider text-gray-500">
            Flow Approval
          </Text>
        </View>
      </View>

      <View className="mt-2">
        {order.handler && (
          <View
            className={`bg-white ${
              order.approvalLinks.length > 0 ? "mb-2" : ""
            }`}
          >
            <View className="flex-row items-start border-l-4 border-indigo-500 px-4 py-4">
              <View className="mr-4 h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
                <MaterialCommunityIcons
                  name="account"
                  size={28}
                  color="#4F46E5"
                />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-base font-semibold text-gray-900">
                      {order.handler.name.toUpperCase()}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </Text>
                  </View>
                  <View className={`rounded-full bg-teal-50 px-3 py-1`}>
                    <Text className={`text-xs font-medium text-teal-800`}>
                      Dibuat
                    </Text>
                  </View>
                </View>

                <View className="mt-2 rounded-lg bg-gray-50 p-3">
                  <Text className="text-sm text-gray-700">Pesanan dibuat</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        {(order.approvalLinks || []).map((approval, index) => {
          const status = approval.isUsed
            ? approval.response
              ? { text: "Approved", color: "green" }
              : { text: "Rejected", color: "red" }
            : { text: "Pending", color: "yellow" };

          return (
            <React.Fragment key={approval.id}>
              <View
                className={`bg-white ${
                  index !== (order.approvalLinks || []).length - 1 ? "mb-2" : ""
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
                    {approval.type === "KITCHEN_DELIVERY" && order.evidence && (
                      <View className="mt-2 rounded-lg bg-gray-50 p-3">
                        <TouchableOpacity
                          onPress={() => {
                            setModalVisible(true);
                            setSelectedImage(
                              `https://a8d8-180-254-75-233.ngrok-free.app/${order.evidence.replace(
                                /\\/g,
                                "/"
                              )}`
                            );
                          }}
                        >
                          <Image
                            source={{
                              uri: `${BASE_URL}/${order.evidence.replace(
                                /\\/g,
                                "/"
                              )}`,
                            }}
                            style={{
                              width: "100%",
                              height: 400,
                              borderRadius: 8,
                            }}
                            resizeMode=""
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </React.Fragment>
          );
        })}
      </View>
    </ScrollView>
  );
};

const OrderDetailScreen = ({ route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();
  const layout = Dimensions.get("window");
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "detail", title: "Detail" },
    { key: "menu", title: "Menu" },
    { key: "approval", title: "Approval" },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuthStore();
  const secretaryStore = useSecretaryStore();
  const adminStore = useAdminStore();

  const store = user?.role === "ADMIN" ? adminStore : secretaryStore;
  const { fetchOrderDetails } = store;
  const { orderId, order: initialOrder } = route.params || {};

  const [order, setOrder] = useState(initialOrder);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  // Effect to load order details
  useEffect(() => {
    const loadOrder = async () => {
      if (orderId && !initialOrder) {
        setIsLoading(true);
        setError(null);
        try {
          const result = await fetchOrderDetails(orderId);
          if (result?.success) {
            setOrder(result.data);
          } else {
            setError(result?.message || "Failed to load order details");
            navigation.goBack();
          }
        } catch (error) {
          console.error("Error loading order details:", error);
          setError(error.message || "An error occurred");
          navigation.goBack();
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadOrder();
  }, [orderId, initialOrder, fetchOrderDetails, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
    }
  }, [error]);

  const [showRejectSheet, setShowRejectSheet] = useState(false);

  const currentApprovalLink = order?.approvalLinks?.find(
    (link) => !link.isUsed
  );
  const notCompletedStatus = order?.status !== "COMPLETED";
  const canApprove =
    currentApprovalLink && user?.role === "ADMIN" && notCompletedStatus;
  const showApproveButton = canApprove;

  const handleRefresh = React.useCallback(async () => {
    if (order?.id) {
      setRefreshing(true);
      try {
        const updatedOrder = await fetchOrderDetails(order.id);
        if (updatedOrder?.success) {
          navigation.setParams({ order: updatedOrder.data });
        }
      } catch (error) {
        console.error("Error refreshing order details:", error);
        Alert.alert("Error", "Failed to refresh order details");
      } finally {
        setRefreshing(false);
      }
    }
  }, [order?.id, fetchOrderDetails]);

  const handleReject = async (reason) => {
    if (!currentApprovalLink?.token) return;
    setIsLoading(true);
    try {
      await respondToRequest(currentApprovalLink.token, false, reason);
      // Refresh all necessary data in both stores to update all screens
      await Promise.all([
        adminStore.fetchOrders(),
        adminStore.fetchRecentActiveOrders(),
        adminStore.fetchRecentActivities(),
        adminStore.fetchStatusStats(),
        adminStore.fetchNewestOrders(),
      ]);
      setShowRejectSheet(false);
      Alert.alert("Success", "Order has been rejected successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to reject order");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!currentApprovalLink?.token) return;
    setIsLoading(true);
    console.log(currentApprovalLink.token);
    try {
      await respondToRequest(
        currentApprovalLink.token,
        true,
        "Request approved"
      );
      // Refresh all necessary data in both stores to update all screens
      await Promise.all([
        adminStore.fetchOrders(),
        adminStore.fetchRecentActiveOrders(),
        adminStore.fetchRecentActivities(),
        adminStore.fetchStatusStats(),
        adminStore.fetchNewestOrders(),
      ]);
      Alert.alert("Success", "Order has been approved successfully");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to approve order");
    } finally {
      setIsLoading(false);
    }
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "detail":
        return (
          <DetailTab
            order={order}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        );
      case "menu":
        return (
          <MenuTab
            order={order}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        );
      case "approval":
        return (
          <ApprovalTab
            order={order}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            setModalVisible={setModalVisible}
            setSelectedImage={setSelectedImage}
          />
        );
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

  // Show loading state while fetching initial order data
  if (isLoading || !order) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="mt-4 text-gray-600">Loading order details...</Text>
      </View>
    );
  }

  return (
    <View className="relative flex-1 bg-white">
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black bg-opacity-95">
          <TouchableOpacity
            className="absolute right-4 top-12 z-10 p-4"
            onPress={() => setModalVisible(false)}
          >
            <MaterialCommunityIcons name="close" size={30} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={{
              width: "100%",
              height: "80%",
              resizeMode: "contain",
            }}
          />
        </View>
      </Modal>
      {/* Header */}
      <View className="bg-blue-800 px-4 pb-3 pt-12 shadow-sm">
        <View className="mb-2 flex-row items-center">
          <View className="flex-1 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mr-5 rounded-full bg-blue-700 p-2"
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>

              <View>
                <Text className="text-2xl font-bold text-white">
                  Detail Pesanan
                </Text>
                <Text className="text-base text-white">Order #{order.id}</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() =>
                handleDelete(
                  order.id,
                  navigation,
                  adminStore,
                  secretaryStore,
                  setIsLoading
                )
              }
              className="rounded-full bg-blue-700 p-2"
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View
        className="flex-1"
        style={{ marginBottom: showApproveButton ? 80 : 0 }}
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>

      {/* Fixed Bottom Buttons */}
      {showApproveButton && (
        <View className="absolute bottom-0 left-0 right-0 flex-row border-t border-gray-200 bg-white px-4 py-4">
          <TouchableOpacity
            className={`flex-1 items-center rounded-xl py-3 shadow-sm ${
              isLoading ? "bg-red-300" : "bg-red-50 border-red-600  border"
            }`}
            onPress={() => setShowRejectSheet(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-red-600">
                REJECT
              </Text>
            )}
          </TouchableOpacity>
          <View className="w-4" />
          <TouchableOpacity
            className={`flex-1 items-center rounded-xl py-3 shadow-sm ${
              isLoading ? "bg-blue-300" : "bg-blue-600"
            }`}
            onPress={handleApprove}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                APPROVE
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9999,
          }}
        >
          <View
            style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
          >
            <ActivityIndicator size="large" color="#4F46E5" />
          </View>
        </View>
      )}

      <RejectReasonSheet
        visible={showRejectSheet}
        onClose={() => setShowRejectSheet(false)}
        onSubmit={handleReject}
        isLoading={isLoading}
      />
    </View>
  );
};

export default OrderDetailScreen;
