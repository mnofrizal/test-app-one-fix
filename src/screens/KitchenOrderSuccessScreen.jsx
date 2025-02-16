import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Share,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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

const KitchenOrderSuccessScreen = ({ route, navigation }) => {
  const { order, photo, note } = route.params;

  React.useEffect(() => {
    const backAction = () => {
      navigation.navigate("MainTabs");
      return true;
    };

    const backHandler = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      backAction();
    });

    return () => backHandler();
  }, [navigation]);

  const handleShare = async () => {
    try {
      const shareMessage =
        `Pesanan #${order.id} telah selesai!\n\n` +
        `${order.judulPekerjaan}\n` +
        `Lokasi: ${order.dropPoint}\n` +
        `PIC: ${order.pic?.name}\n` +
        `Waktu: ${formatDate(order.requestDate)}\n` +
        `${note ? `\nCatatan: ${note}` : ""}`;

      const result = await Share.share({
        message: shareMessage,
        url: photo.uri,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBackHome = () => {
    navigation.navigate("MainTabs");
  };

  const getTotalItems = (employeeOrders) => {
    try {
      return (
        employeeOrders?.reduce(
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Success Icon and Message */}
      <View className="items-center pt-8">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <MaterialCommunityIcons
            name="check-circle"
            size={48}
            color="#22C55E"
          />
        </View>
        <Text className="mb-2 text-2xl font-bold text-gray-900">
          Pesanan Selesai!
        </Text>
        <Text className="text-base text-gray-600">
          Pesanan #{order.id} berhasil diselesaikan
        </Text>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 190 }}
      >
        {/* Order Summary */}
        <View className="mx-4 mt-8 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Ringkasan Pesanan
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Judul</Text>
              <Text className="font-medium text-gray-900">
                {order.judulPekerjaan || "-"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Kategori</Text>
              <Text className="font-medium text-gray-900">
                {order.category || "-"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">PIC</Text>
              <Text className="font-medium text-gray-900">
                {order.pic?.name || "-"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Lokasi</Text>
              <Text className="font-medium text-gray-900">
                {order.dropPoint || "-"}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Waktu Request</Text>
              <Text className="font-medium text-gray-900">
                Jam {formatDate(order.requestDate)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Menu</Text>
              <Text className="font-medium text-gray-900">
                {getTotalItems(order.employeeOrders)} item
              </Text>
            </View>
          </View>
        </View>

        {/* Photo Evidence */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Foto Bukti
          </Text>
          <Image
            source={{ uri: photo.uri }}
            className="h-48 w-full rounded-lg"
            resizeMode="cover"
          />
          {note ? (
            <Text className="mt-3 text-base text-gray-600">
              Catatan: {note}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 space-y-3 bg-white p-4 shadow-lg">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-xl bg-blue-600 py-4"
          onPress={handleShare}
        >
          <MaterialCommunityIcons
            name="share-variant"
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text className="font-semibold text-white">Bagikan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-xl border border-gray-300 bg-white py-4"
          onPress={handleBackHome}
        >
          <MaterialCommunityIcons
            name="home"
            size={24}
            color="#1F2937"
            style={{ marginRight: 8 }}
          />
          <Text className="font-semibold text-gray-900">Kembali ke Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default KitchenOrderSuccessScreen;
