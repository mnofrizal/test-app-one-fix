import React from "react";
import { View, Text, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function JobTitleSelection({ jobTitle, onPress }) {
  return (
    <Pressable onPress={onPress} className="mb-4 rounded-xl bg-white shadow-sm">
      <View className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-800">
              Judul Pekerjaan
            </Text>
            {jobTitle ? (
              <Text className="mt-1 text-base text-gray-600">{jobTitle}</Text>
            ) : (
              <Text className="mt-1 text-base text-gray-400">
                Tambah judul pekerjaan
              </Text>
            )}
          </View>
          <View
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              jobTitle ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <MaterialCommunityIcons
              name={jobTitle ? "pencil" : "plus"}
              size={20}
              color={jobTitle ? "#3B82F6" : "#9CA3AF"}
            />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
