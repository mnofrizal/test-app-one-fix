import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";

const OptionCard = ({ title, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={onSelect}
    className={`mb-3 rounded-lg border p-4 ${
      isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
    }`}
  >
    <View className="flex-row items-center justify-between">
      <Text className="text-base font-medium text-gray-800">{title}</Text>
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

const PersonOrderForm = ({ entity, index }) => {
  const { formData, updateEmployeeOrders } = useMealOrderStore();
  const orders = formData.employeeOrders.filter((o) => o.entity === entity);
  const order = orders[index] || {
    entity,
    employeeName: "",
    items: [{ menuItemId: "", quantity: 1 }],
  };

  const updateOrder = (newData) => {
    const newOrders = formData.employeeOrders.filter(
      (o) => !(o.entity === entity && o.index === index)
    );
    updateEmployeeOrders([...newOrders, { ...order, ...newData, index }]);
  };

  return (
    <View className="mb-4 rounded-lg border border-gray-100 bg-white p-4">
      <Text className="mb-3 text-sm font-medium text-gray-600">
        Pegawai {index + 1}
      </Text>
      <View className="space-y-3">
        <TextInput
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
          value={order.employeeName}
          onChangeText={(text) => updateOrder({ employeeName: text })}
          placeholder="Nama Pegawai"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
          value={order.items[0]?.menuItemId}
          onChangeText={(text) =>
            updateOrder({
              items: [{ ...order.items[0], menuItemId: text }],
            })
          }
          placeholder="Menu"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
          value={order.note}
          onChangeText={(text) => updateOrder({ note: text })}
          placeholder="Catatan"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
};

const EntityOrderSection = ({ entity, count }) => {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-base font-medium text-gray-800">{entity}</Text>
      {Array.from({ length: count }).map((_, index) => (
        <PersonOrderForm
          key={`${entity}-${index}`}
          entity={entity}
          index={index}
        />
      ))}
    </View>
  );
};

export const MenuStep = () => {
  const { formData, setOrderType, updateBulkOrder } = useMealOrderStore();
  const selectedEntities = Object.entries(formData.selectedEntities)
    .filter(([_, isSelected]) => isSelected)
    .map(([entity]) => ({ entity, count: formData.entityCounts[entity] }));

  useEffect(() => {
    // Reset form type if not set
    if (!formData.orderType) {
      setOrderType("detail");
    }
  }, []);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1">
        <View className="p-4">
          <Text className="mb-4 text-lg font-semibold text-gray-800">
            Pilih Jenis Pesanan
          </Text>

          <View className="mb-6">
            <OptionCard
              title="1. Isi Detail"
              isSelected={formData.orderType === "detail"}
              onSelect={() => setOrderType("detail")}
            />
            <OptionCard
              title="2. Isi 1 Untuk Semua"
              isSelected={formData.orderType === "bulk"}
              onSelect={() => setOrderType("bulk")}
            />
          </View>

          {formData.orderType === "bulk" ? (
            <View className="space-y-3">
              <TextInput
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                value={formData.bulkOrder.menuItemId}
                onChangeText={(text) => updateBulkOrder({ menuItemId: text })}
                placeholder="Menu untuk semua"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                value={formData.bulkOrder.note}
                onChangeText={(text) => updateBulkOrder({ note: text })}
                placeholder="Catatan"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          ) : (
            selectedEntities.map(({ entity, count }) => (
              <EntityOrderSection key={entity} entity={entity} count={count} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
