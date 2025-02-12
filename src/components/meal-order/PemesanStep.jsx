import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";
import { mockUsers } from "../../constants/mockUsers";

// Entity descriptions
const entityDescriptions = {
  PLNIP: "PLN Indonesia Power",
  IPS: "Indonesia Power Services",
  KOP: "Koperasi",
  RSU: "Rusamas Sarana Usaha",
  MITRA: "Mitra Kerja",
  OTHER: "Lainnya",
};

// Entity relationships for ordering
const entities = ["PLNIP", "IPS", "KOP", "RSU", "MITRA", "OTHER"];

// Entity icons
const entityIcons = {
  PLNIP: "lightning-bolt", // Keep lightning for PLN
  IPS: "lightning-bolt-circle", // Similar to PLNIP but with variant to show relationship
  KOP: "store", // Keep store for Koperasi
  RSU: "store-cog", // Store variant to show relationship with KOP
  MITRA: "handshake", // Keep handshake for partnership
  OTHER: "dots-horizontal", // Keep dots for misc
};

const EntityCard = ({
  entity,
  isSelected,
  count,
  onSelect,
  onCountChange,
  maxCount,
}) => {
  const isAtMax = maxCount !== undefined && count >= maxCount;
  const showWarning = isSelected && isAtMax;

  return (
    <View
      className={`mb-4 overflow-hidden rounded-xl border border-gray-200 bg-white`}
    >
      <TouchableOpacity
        onPress={onSelect}
        className={`flex-row items-center justify-between space-x-2 p-4 ${
          isSelected ? "border-b border-gray-100" : ""
        }`}
      >
        <View className="flex-row items-center justify-center">
          <MaterialCommunityIcons
            name={entityIcons[entity]}
            size={22}
            color={isSelected ? "#3B82F6" : "#6B7280"}
          />
          <Text
            className={`ml-2 text-lg font-medium ${
              isSelected ? "text-blue-600" : "text-gray-800"
            }`}
          >
            {entity}
          </Text>
        </View>
        {!isSelected && (
          <Text className="mt-1 text-sm text-gray-500">
            {entityDescriptions[entity]}
          </Text>
        )}

        {isSelected && (
          <View className="mt-2 flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => count > 0 && onCountChange(count - 1)}
              className={`rounded-lg border border-gray-200 bg-white p-2 ${
                count === 0 ? "opacity-50" : ""
              }`}
              disabled={count === 0}
            >
              <MaterialCommunityIcons
                name="minus"
                size={18}
                color={count === 0 ? "#9CA3AF" : "#374151"}
              />
            </TouchableOpacity>
            <Text className="mx-4 min-w-[32px] text-center text-base font-medium text-gray-900">
              {count}
            </Text>
            <TouchableOpacity
              onPress={() =>
                count < (maxCount || Infinity) && onCountChange(count + 1)
              }
              className={`rounded-lg border border-gray-200 bg-white p-2 ${
                isAtMax ? "opacity-50" : ""
              }`}
              disabled={isAtMax}
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={isAtMax ? "#9CA3AF" : "#374151"}
              />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      {isSelected && (
        <View className="bg-gray-50 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-medium text-gray-700">
              Jumlah Orang
            </Text>
            {maxCount && (
              <Text
                className={`text-sm ${
                  showWarning ? "text-red-500" : "text-gray-500"
                }`}
              >
                {showWarning ? "Maksimal tercapai" : `Max ${maxCount} orang`}
              </Text>
            )}
            {entity !== "PLNIP" && (
              <Text
                className={`text-sm "text-gray-500"
        }`}
              >
                {`${count} orang`}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export const PemesanStep = () => {
  const { formData, toggleEntity, updateEntityCount } = useMealOrderStore();

  // Get member count from supervisor's department
  const departmentMemberCount = formData.supervisor.subBidang
    ? mockUsers[formData.supervisor.subBidang]?.length || 0
    : 0;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4 py-4">
        <Text className="mb-1 text-xl font-semibold text-gray-900">
          Pilih Institusi
        </Text>
        <Text className="mb-6 text-sm text-gray-500">
          Pilih dan tentukan jumlah pesanan untuk setiap institusi
        </Text>
        {entities.map((entity) => (
          <EntityCard
            key={entity}
            entity={entity}
            isSelected={formData.selectedEntities[entity]}
            count={formData.entityCounts[entity]}
            onSelect={() => toggleEntity(entity)}
            onCountChange={(count) => updateEntityCount(entity, count)}
            maxCount={entity === "PLNIP" ? departmentMemberCount : undefined}
          />
        ))}
      </View>
    </ScrollView>
  );
};
