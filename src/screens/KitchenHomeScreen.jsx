import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../store/authStore";

const OrderCard = ({ order, onPress, onComplete }) => (
  <View className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <View className="flex-row items-start justify-between">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900">
          Order #{order.id}
        </Text>
        <Text className="mt-1 text-sm text-gray-600">
          Departemen: {order.department}
        </Text>
        <Text className="text-sm text-gray-600">
          Jumlah Menu: {order.itemCount}
        </Text>
      </View>
      <View className="rounded-full bg-blue-100 px-3 py-1">
        <Text className="text-sm font-medium text-blue-800">{order.time}</Text>
      </View>
    </View>
    <View className="mt-3 flex-row items-center justify-between">
      <Text className="text-sm font-medium text-gray-600">
        PIC: {order.picName}
      </Text>
      {order.status === "masuk" && (
        <TouchableOpacity
          className="flex-row items-center rounded-lg bg-blue-600 px-4 py-2"
          onPress={() => onPress(order)}
        >
          <MaterialCommunityIcons
            name="play-circle"
            size={20}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text className="font-medium text-white">Proses Pesanan</Text>
        </TouchableOpacity>
      )}
      {order.status === "proses" && (
        <TouchableOpacity
          className="flex-row items-center rounded-lg bg-green-600 px-4 py-2"
          onPress={() => onComplete(order)}
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color="white"
            style={{ marginRight: 4 }}
          />
          <Text className="font-medium text-white">Selesaikan</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const KitchenHomeScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState("masuk"); // masuk, proses, selesai

  // Dummy data
  const stats = {
    masuk: 5,
    proses: 3,
  };

  const orders = {
    masuk: [
      {
        id: "001",
        department: "Engineering",
        itemCount: 10,
        time: "10:30",
        picName: "John Doe",
        status: "masuk",
      },
      {
        id: "002",
        department: "Sales",
        itemCount: 5,
        time: "10:45",
        picName: "Jane Smith",
        status: "masuk",
      },
    ],
    proses: [
      {
        id: "003",
        department: "Marketing",
        itemCount: 8,
        time: "10:15",
        picName: "Bob Wilson",
        status: "proses",
      },
      {
        id: "004",
        department: "HR",
        itemCount: 3,
        time: "10:20",
        picName: "Alice Brown",
        status: "proses",
      },
    ],
    selesai: [
      {
        id: "005",
        department: "Finance",
        itemCount: 6,
        time: "09:30",
        picName: "Carol White",
        status: "selesai",
      },
      {
        id: "006",
        department: "IT",
        itemCount: 4,
        time: "09:45",
        picName: "Dave Black",
        status: "selesai",
      },
    ],
  };

  const handleOrderPress = (order) => {
    navigation.navigate("KitchenOrderDetail", { order });
  };

  const handleCompletePress = (order) => {
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
              {stats.masuk}
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
              {stats.proses}
            </Text>
          </View>
        </View>
      </View>

      {/* Order Tabs */}
      <View className="flex-row justify-between border-b border-gray-200 bg-white px-4">
        <TabItem name="masuk" label="Menunggu" icon="clock-outline" />
        <TabItem name="proses" label="Diproses" icon="progress-clock" />
        <TabItem name="selesai" label="Selesai" icon="check-circle" />
      </View>

      {/* Order List */}
      <ScrollView className="flex-1 p-4">
        {orders[activeTab].map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onPress={handleOrderPress}
            onComplete={handleCompletePress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default KitchenHomeScreen;
