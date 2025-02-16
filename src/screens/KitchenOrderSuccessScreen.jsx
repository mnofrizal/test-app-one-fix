import React from "react";
import { View, Text, TouchableOpacity, Image, Share } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

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
      const result = await Share.share({
        message: `Pesanan #${order.id} telah selesai.\n\nCatatan: ${note}`,
        url: photo.uri,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleBackHome = () => {
    navigation.navigate("MainTabs");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1">
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

        {/* Order Summary */}
        <View className="mx-4 mt-8 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Ringkasan Pesanan
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Departemen</Text>
              <Text className="font-medium text-gray-900">
                {order.department}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">PIC</Text>
              <Text className="font-medium text-gray-900">{order.picName}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Waktu</Text>
              <Text className="font-medium text-gray-900">{order.time}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Jumlah Menu</Text>
              <Text className="font-medium text-gray-900">
                {order.itemCount} item
              </Text>
            </View>
          </View>
        </View>

        {/* Photo Evidence */}
        <View className="mx-4 mt-4 rounded-xl bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold text-gray-900">
            Foto Pesanan
          </Text>
          <Image
            source={{ uri: photo.uri }}
            className="h-48 w-full rounded-lg"
            resizeMode="cover"
          />
          <Text className="mt-3 text-base text-gray-600">{note}</Text>
        </View>

        {/* Action Buttons */}
        <View className="mt-auto space-y-3 p-4">
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
      </View>
    </SafeAreaView>
  );
};

export default KitchenOrderSuccessScreen;
