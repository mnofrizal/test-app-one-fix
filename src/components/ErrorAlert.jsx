import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ErrorAlert = ({ visible, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50">
        <View className="m-5 w-[90%] rounded-2xl bg-white p-6 shadow-xl">
          <View className="mb-4 flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color="#DC2626"
              />
            </View>
            <Text className="ml-3 flex-1 text-lg font-semibold text-gray-900">
              Login Failed
            </Text>
          </View>

          <Text className="mb-4 text-base text-gray-600">{message}</Text>

          <TouchableOpacity
            onPress={onClose}
            className="rounded-xl bg-red-600 px-5 py-3"
          >
            <Text className="text-center text-base font-semibold text-white">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ErrorAlert;
