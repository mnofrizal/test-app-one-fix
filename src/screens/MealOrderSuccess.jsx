import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const MealOrderSuccess = () => {
  const navigation = useNavigation();

  const handleShare = () => {
    // Implement share functionality
    console.log("Share order details");
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-1 items-center justify-center p-4">
        <View className="mb-6 h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <MaterialCommunityIcons
            name="check-circle"
            size={64}
            color="#22C55E"
          />
        </View>

        <Text className="mb-2 text-2xl font-bold text-gray-800">
          Order Successful!
        </Text>
        <Text className="mb-8 text-center text-gray-600">
          Your meal order has been successfully submitted. You can track its
          status in the Orders section.
        </Text>

        <View className="w-full space-y-4">
          <TouchableOpacity
            className="w-full rounded-lg bg-blue-500 py-4"
            onPress={handleShare}
          >
            <View className="flex-row items-center justify-center">
              <MaterialCommunityIcons
                name="share-variant"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-center font-medium text-white">
                Share Order Details
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full rounded-lg border-2 border-blue-500 bg-white py-4"
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text className="text-center font-medium text-blue-500">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MealOrderSuccess;
