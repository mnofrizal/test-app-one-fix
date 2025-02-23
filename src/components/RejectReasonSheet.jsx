import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import BottomSheet from "./BottomSheet";

const RejectReasonSheet = ({ visible, onClose, onSubmit, isLoading }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    onSubmit(reason);
    setReason("");
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["50%"]}>
      <View className="flex-1 px-6">
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-900">Reject Order</Text>
          <Text className="mt-1 text-base text-gray-500">
            Please provide a reason for rejecting this order
          </Text>
        </View>

        <TextInput
          className="mb-6 rounded-lg border border-gray-200 bg-white px-4 py-3 text-base text-gray-900"
          placeholder="Enter rejection reason"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <View className="flex-row space-x-4">
          <TouchableOpacity
            className="flex-1 items-center rounded-lg border border-gray-200 bg-white py-4"
            onPress={onClose}
            disabled={isLoading}
          >
            <Text className="text-base font-semibold text-gray-900">
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 items-center rounded-lg bg-red-600 py-4"
            onPress={handleSubmit}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">Reject</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

export default RejectReasonSheet;
