import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function EmployeeSelection({ employee, onPress }) {
  const hasOrder = employee?.menuName;

  return (
    <Pressable onPress={onPress} className="mb-4 rounded-xl bg-white shadow-sm">
      <View className="p-4">
        <View className="mb-2 flex-row items-center justify-between">
          <View>
            {employee?.name ? (
              <Text className="text-lg font-bold text-gray-800">
                {employee.name}
              </Text>
            ) : (
              <>
                <Text className="text-lg font-bold text-gray-800">
                  Pilih Pegawai
                </Text>
                <Text className="mt-1 text-base text-gray-400">
                  Pilih pegawai untuk pesanan
                </Text>
              </>
            )}
          </View>
          <View
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              employee?.name ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <MaterialCommunityIcons
              name={employee?.name ? "pencil" : "plus"}
              size={20}
              color={employee?.name ? "#3B82F6" : "#9CA3AF"}
            />
          </View>
        </View>

        {/* Show menu and note if selected */}
        {hasOrder && (
          <View className="mt-2 space-y-1 border-t border-gray-100 pt-2">
            <Text className="text-sm font-medium text-gray-800">
              {employee.menuName}
            </Text>
            {employee.note && (
              <Text className="text-sm text-gray-500">{employee.note}</Text>
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
