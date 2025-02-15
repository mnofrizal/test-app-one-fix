import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";
import { useEmployeeStore } from "../../store/employeeStore";

const entityDescriptions = {
  PLNIP: "PLN Indonesia Power",
  IPS: "Indonesia Power Services",
  KOP: "Koperasi",
  RSU: "Rusamas Sarana Usaha",
  MITRA: "Mitra Kerja",
  OTHER: "Lainnya",
};

const entities = ["PLNIP", "IPS", "KOP", "RSU", "MITRA", "OTHER"];

const entityIcons = {
  PLNIP: "lightning-bolt",
  IPS: "lightning-bolt-circle",
  KOP: "store",
  RSU: "store-cog",
  MITRA: "handshake",
  OTHER: "dots-horizontal",
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
      className={`mb-4 overflow-hidden rounded-2xl border  ${
        isSelected ? "border-indigo-200" : "border-slate-200"
      } bg-white shadow-sm`}
    >
      <TouchableOpacity
        onPress={onSelect}
        className={`flex-row items-center justify-between space-x-2 p-5 ${
          isSelected ? "border-b border-slate-100" : ""
        }`}
      >
        <View className="flex-row items-center justify-center">
          <View
            className={`rounded-lg p-2 ${
              isSelected ? "bg-indigo-100" : "bg-slate-50"
            }`}
          >
            <MaterialCommunityIcons
              name={entityIcons[entity]}
              size={24}
              color={isSelected ? "#4F46E5" : "#64748B"}
            />
          </View>
          <View className="ml-3">
            <Text
              className={`text-lg font-semibold ${
                isSelected ? "text-indigo-600" : "text-gray-900"
              }`}
            >
              {entity}
            </Text>
            {!isSelected && (
              <Text className="text-sm text-slate-500">
                {entityDescriptions[entity]}
              </Text>
            )}
          </View>
        </View>

        {isSelected ? (
          <View className="mt-2 flex-row items-center justify-center">
            <TouchableOpacity
              onPress={() => count > 0 && onCountChange(count - 1)}
              className={`rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm ${
                count === 0 ? "opacity-50" : ""
              }`}
              disabled={count === 0}
            >
              <MaterialCommunityIcons
                name="minus"
                size={20}
                color={count === 0 ? "#94A3B8" : "#1E293B"}
              />
            </TouchableOpacity>
            <Text className="mx-5 min-w-[32px] text-center text-lg font-semibold text-gray-900">
              {count}
            </Text>
            <TouchableOpacity
              onPress={() =>
                count < (maxCount || Infinity) && onCountChange(count + 1)
              }
              className={`rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm ${
                isAtMax ? "opacity-50" : ""
              }`}
              disabled={isAtMax}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={isAtMax ? "#94A3B8" : "#1E293B"}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#64748B"
          />
        )}
      </TouchableOpacity>
      {isSelected && (
        <View className="bg-slate-50 px-5 py-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color={showWarning ? "#DC2626" : "#4F46E5"}
              />
              <Text
                className={`ml-2 text-base font-medium ${
                  showWarning ? "text-red-700" : "text-gray-700"
                }`}
              >
                Jumlah Orang
              </Text>
            </View>
            {maxCount && (
              <Text
                className={`text-sm font-medium ${
                  showWarning ? "text-red-600" : "text-slate-500"
                }`}
              >
                {showWarning ? "Maksimal tercapai" : `Max ${maxCount} orang`}
              </Text>
            )}
            {entity !== "PLNIP" && (
              <Text className="text-sm font-medium text-slate-500">
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

  const { employeesByDepartment, getDepartmentEmployees } = useEmployeeStore();

  // Get count of non-supervisor employees in the selected department
  const departmentMemberCount = formData.supervisor.subBidang
    ? getDepartmentEmployees(formData.supervisor.subBidang).length
    : 0;

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="p-6">
        <Text className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Pilih Institusi
        </Text>
        <Text className="mb-8 text-base font-medium text-slate-500">
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
