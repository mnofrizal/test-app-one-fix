import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useMenuStore } from "../../store/menuStore";

const CATEGORIES = [
  { label: "Heavy Meal", value: "HEAVY_MEAL" },
  { label: "Snack", value: "SNACK" },
];

const AddMenuSheet = ({ visible, onClose }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState("");
  const bottomSheetRef = useRef(null);
  const { addMenu, isLoading } = useMenuStore();

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Menu name is required");
      return;
    }

    const result = await addMenu({
      name: name.trim(),
      category,
      isAvailable,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (result.success) {
      setName("");
      setCategory(CATEGORIES[0].value);
      setIsAvailable(true);
      setError("");
      bottomSheetRef.current?.dismiss();
      onClose();
    } else {
      setError(result.message || "Failed to add menu");
    }
  };

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      visible={visible}
      onClose={onClose}
      snapPoints={["75%"]}
    >
      <View className="relative flex-1">
        {/* Header */}
        <View className="border-b border-gray-100 bg-white px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleClose}
              className="rounded-full p-2"
            >
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">
              Add New Menu
            </Text>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading || !name.trim()}
              className={`rounded-lg px-3 py-2 ${
                isLoading || !name.trim() ? "opacity-50" : "bg-indigo-50"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#4F46E5" />
              ) : (
                <Text
                  className={`text-sm font-medium ${
                    !name.trim() ? "text-gray-400" : "text-indigo-600"
                  }`}
                >
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Content */}
        <View className="p-4">
          {/* Name Input */}
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Menu Name
            </Text>
            <View className="rounded-xl bg-gray-100 p-3">
              <BottomSheetTextInput
                className="rounded-lg bg-white px-4 py-2.5 text-base shadow-sm"
                placeholder="Enter menu name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            {error ? (
              <Text className="mt-1 text-sm text-red-600">{error}</Text>
            ) : null}
          </View>

          {/* Category Picker */}
          <View className="mb-4">
            <Text className="mb-1 text-sm font-medium text-gray-700">
              Category
            </Text>
            <View className="overflow-hidden rounded-lg border border-gray-200">
              <Picker
                selectedValue={category}
                onValueChange={setCategory}
                style={{ backgroundColor: "white" }}
              >
                {CATEGORIES.map((cat) => (
                  <Picker.Item
                    key={cat.value}
                    label={cat.label}
                    value={cat.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Availability Toggle */}
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-700">
              Available for Order
            </Text>
            <Switch
              value={isAvailable}
              onValueChange={setIsAvailable}
              trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
              thumbColor={isAvailable ? "#2563eb" : "#f4f4f5"}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default AddMenuSheet;
