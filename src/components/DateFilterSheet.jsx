import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "./BottomSheet";

const DateFilterSheet = ({ visible, onClose, onSelect, selectedFilter }) => {
  const filters = [
    { value: "today", label: "Today", icon: "calendar-today" },
    { value: "week", label: "Last Week", icon: "calendar-week" },
    { value: "month", label: "Last Month", icon: "calendar-month" },
    { value: "range", label: "Custom Range", icon: "calendar-range" },
    { value: null, label: "Clear Filter", icon: "calendar-remove" },
  ];

  const handleSelect = (filter) => {
    onSelect(filter);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["50%"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-gray-100 bg-white px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose} className="rounded-full p-2">
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">
              Filter by Date
            </Text>
            <View className="h-8 w-8" />
          </View>
        </View>

        {/* Filter Options */}
        <View className="p-4">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value ?? "clear"}
              onPress={() => handleSelect(filter.value)}
              className={`mb-2 flex-row items-center rounded-xl border p-4 ${
                selectedFilter === filter.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <MaterialCommunityIcons
                name={filter.icon}
                size={24}
                color={selectedFilter === filter.value ? "#3B82F6" : "#64748B"}
              />
              <Text
                className={`ml-3 text-base ${
                  selectedFilter === filter.value
                    ? "font-medium text-blue-700"
                    : "text-gray-900"
                }`}
              >
                {filter.label}
              </Text>
              {selectedFilter === filter.value && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#3B82F6"
                  style={{ marginLeft: "auto" }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
};

export default DateFilterSheet;
