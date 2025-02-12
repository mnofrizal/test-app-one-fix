import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import EmployeeSelectSheet from "./EmployeeSelectSheet";
import MenuSelectSheet from "./MenuSelectSheet";
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
  const [employeeSheetVisible, setEmployeeSheetVisible] = useState(false);
  const [menuSheetVisible, setMenuSheetVisible] = useState(false);
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
      {/* Selection sheets */}
      <EmployeeSelectSheet
        visible={employeeSheetVisible}
        onClose={() => setEmployeeSheetVisible(false)}
        onSelect={(employee) =>
          updateOrder({ employeeName: employee.name, employeeId: employee.id })
        }
        selected={
          order.employeeName
            ? { name: order.employeeName, id: order.employeeId }
            : null
        }
        department={formData.supervisor.subBidang}
        isPlnip={entity === "PLNIP"}
      />

      <MenuSelectSheet
        visible={menuSheetVisible}
        onClose={() => setMenuSheetVisible(false)}
        onSelect={(menu) =>
          updateOrder({
            items: [{ menuItemId: menu.id, menuName: menu.name }],
          })
        }
        selected={
          order.items[0]?.menuItemId
            ? {
                id: order.items[0].menuItemId,
                name: order.items[0].menuName,
              }
            : null
        }
      />

      <Text className="mb-3 text-sm font-medium text-gray-600">
        Pegawai {index + 1}
      </Text>
      <View className="space-y-3">
        <TouchableOpacity
          onPress={() => setEmployeeSheetVisible(true)}
          className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5"
        >
          <Text
            className={order.employeeName ? "text-gray-900" : "text-gray-400"}
          >
            {order.employeeName || "Select Employee Name"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMenuSheetVisible(true)}
          className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5"
        >
          <Text
            className={
              order.items[0]?.menuName ? "text-gray-900" : "text-gray-400"
            }
          >
            {order.items[0]?.menuName || "Select Menu"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
        <TextInput
          ref={(ref) => {
            if (ref) {
              ref.setNativeProps({ text: order.note });
            }
          }}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
          defaultValue={order.note}
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
  const [bulkMenuSheetVisible, setBulkMenuSheetVisible] = useState(false);
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
              <MenuSelectSheet
                visible={bulkMenuSheetVisible}
                onClose={() => setBulkMenuSheetVisible(false)}
                onSelect={(menu) =>
                  updateBulkOrder({
                    menuItemId: menu.id,
                    menuName: menu.name,
                  })
                }
                selected={
                  formData.bulkOrder.menuItemId
                    ? {
                        id: formData.bulkOrder.menuItemId,
                        name: formData.bulkOrder.menuName,
                      }
                    : null
                }
              />

              <TouchableOpacity
                onPress={() => setBulkMenuSheetVisible(true)}
                className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5"
              >
                <Text
                  className={
                    formData.bulkOrder.menuName
                      ? "text-gray-900"
                      : "text-gray-400"
                  }
                >
                  {formData.bulkOrder.menuName || "Select Menu for All"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
              <TextInput
                ref={(ref) => {
                  if (ref) {
                    ref.setNativeProps({ text: formData.bulkOrder.note });
                  }
                }}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                defaultValue={formData.bulkOrder.note}
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
