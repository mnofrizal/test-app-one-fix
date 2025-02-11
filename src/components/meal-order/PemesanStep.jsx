import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";

const EntityCard = ({ entity, isSelected, count, onSelect, onCountChange }) => (
  <TouchableOpacity
    onPress={onSelect}
    className={`mb-3 rounded-lg border p-4 ${
      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
    }`}
  >
    <View className="flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-base font-medium text-gray-800">{entity}</Text>
        {isSelected && (
          <View className="mt-3 flex-row items-center">
            <Text className="mr-3 text-sm text-gray-600">Jumlah Orang:</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => count > 0 && onCountChange(count - 1)}
                className={`rounded-lg bg-gray-100 p-2 ${
                  count === 0 ? "opacity-50" : ""
                }`}
                disabled={count === 0}
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={20}
                  color="#374151"
                />
              </TouchableOpacity>
              <Text className="mx-4 min-w-[24px] text-center text-base font-medium">
                {count}
              </Text>
              <TouchableOpacity
                onPress={() => onCountChange(count + 1)}
                className="rounded-lg bg-gray-100 p-2"
              >
                <MaterialCommunityIcons name="plus" size={20} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
          isSelected
            ? "border-blue-500 bg-blue-500"
            : "border-gray-300 bg-white"
        }`}
      >
        {isSelected && (
          <MaterialCommunityIcons name="check" size={16} color="white" />
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export const PemesanStep = () => {
  const { formData, toggleEntity, updateEntityCount } = useMealOrderStore();
  const entities = ["PLNIP", "IPS", "KOP", "RSU", "MITRA", "OTHER"];

  return (
    <View className="p-4">
      <Text className="mb-4 text-lg font-semibold text-gray-800">
        Pilih Institusi
      </Text>
      {entities.map((entity) => (
        <EntityCard
          key={entity}
          entity={entity}
          isSelected={formData.selectedEntities[entity]}
          count={formData.entityCounts[entity]}
          onSelect={() => toggleEntity(entity)}
          onCountChange={(count) => updateEntityCount(entity, count)}
        />
      ))}
    </View>
  );
};
