import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, Switch } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";
import EmployeeSelection from "./EmployeeSelection";
import EnhancedEmployeeSelectSheet from "./EnhancedEmployeeSelectSheet";
import MenuSelectSheet from "./MenuSelectSheet";

const OptionCard = ({ title, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={onSelect}
    className={`mb-4 rounded-xl border p-5 shadow-sm transition-colors ${
      isSelected
        ? "border-indigo-500 bg-indigo-50"
        : "border-slate-200 bg-white"
    }`}
  >
    <View className="flex-row items-center justify-between">
      <Text
        className={`text-lg font-semibold ${
          isSelected ? "text-indigo-700" : "text-gray-900"
        }`}
      >
        {title}
      </Text>
      <View
        className={`h-7 w-7 items-center justify-center rounded-full border-2 ${
          isSelected
            ? "border-indigo-500 bg-indigo-500"
            : "border-slate-300 bg-white"
        }`}
      >
        {isSelected && (
          <MaterialCommunityIcons name="check" size={18} color="white" />
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const DetailOrderSection = ({ entity, count }) => {
  const { formData, updateEmployeeOrders } = useMealOrderStore();
  const [employeeSheetVisible, setEmployeeSheetVisible] = useState(false);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  const handleComplete =
    (entity, index) =>
    ({ employee, menu, note }) => {
      const order = {
        entity,
        index,
        employeeName: employee.name,
        employeeId: employee.id,
        items: [{ menuItemId: menu.id, menuName: menu.name }],
        note,
      };

      if (formData.sameBulkMenu[entity] && entity !== "PLNIP") {
        const otherEntityOrders = formData.employeeOrders.filter(
          (o) => o.entity !== entity
        );

        const template = {
          ...order,
          employeeName: `Pegawai ${entity}`,
          employeeId: `${entity}_0`,
          items: [{ menuItemId: menu.id, menuName: menu.name }],
          note: note || "",
        };

        const currentEntityOrders = Array.from({ length: count }).map(
          (_, i) => ({
            ...template,
            index: i,
            employeeId: `${entity}_${i}`,
          })
        );

        updateEmployeeOrders([...otherEntityOrders, ...currentEntityOrders]);
      } else {
        const newOrders = formData.employeeOrders.filter(
          (o) => !(o.entity === entity && o.index === index)
        );
        updateEmployeeOrders([...newOrders, order]);
      }
    };

  const getOrder = (entity, index) => {
    return formData.employeeOrders.find(
      (o) => o.entity === entity && o.index === index
    );
  };

  const showBulkSwitch = entity !== "PLNIP";
  const bulkModeOrder = formData.sameBulkMenu[entity]
    ? getOrder(entity, 0)
    : null;

  return (
    <View className="">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">{entity}</Text>
        {showBulkSwitch && (
          <View className="flex-row items-center space-x-3">
            <Text className="text-sm font-medium text-slate-600">
              Samakan Menu
            </Text>
            <Switch
              value={formData.sameBulkMenu[entity] || false}
              onValueChange={(value) => {
                const { toggleSameBulkMenu } = useMealOrderStore.getState();
                toggleSameBulkMenu(entity, value);
              }}
            />
          </View>
        )}
      </View>

      {formData.sameBulkMenu[entity] ? (
        <View className="mb-3">
          <EmployeeSelection
            employee={
              bulkModeOrder
                ? {
                    id: `${entity}_0`,
                    name: `${count}x ${
                      entity === "PLNIP" ? "Pegawai PLNIP" : `Pegawai ${entity}`
                    }`,
                    menuName: bulkModeOrder.items[0]?.menuName,
                    note: bulkModeOrder.note,
                  }
                : null
            }
            onPress={() => {
              setCurrentEntity(entity);
              setCurrentIndex(0);
              setEmployeeSheetVisible(true);
            }}
          />
          <EnhancedEmployeeSelectSheet
            visible={
              employeeSheetVisible &&
              currentEntity === entity &&
              currentIndex === 0
            }
            onClose={() => {
              setEmployeeSheetVisible(false);
              setCurrentEntity(null);
              setCurrentIndex(null);
            }}
            onComplete={handleComplete(entity, 0)}
            selected={
              bulkModeOrder
                ? {
                    id: bulkModeOrder.employeeId,
                    name: `Pegawai ${entity}`,
                  }
                : null
            }
            department={formData.supervisor.subBidang}
            isPlnip={entity === "PLNIP"}
            entity={entity}
            isSameBulkMenu={formData.sameBulkMenu[entity]}
          />
        </View>
      ) : (
        Array.from({ length: count }).map((_, index) => {
          const order = getOrder(entity, index);
          return (
            <View key={`${entity}-${index}`} className="mb-1">
              <EmployeeSelection
                employee={
                  order
                    ? {
                        id: order.employeeId,
                        name: order.employeeName,
                        menuName: order.items[0]?.menuName,
                        note: order.note,
                      }
                    : null
                }
                onPress={() => {
                  setCurrentEntity(entity);
                  setCurrentIndex(index);
                  setEmployeeSheetVisible(true);
                }}
              />
              <EnhancedEmployeeSelectSheet
                visible={
                  employeeSheetVisible &&
                  currentEntity === entity &&
                  currentIndex === index
                }
                onClose={() => {
                  setEmployeeSheetVisible(false);
                  setCurrentEntity(null);
                  setCurrentIndex(null);
                }}
                onComplete={handleComplete(entity, index)}
                selected={
                  order
                    ? {
                        id: order.employeeId,
                        name: order.employeeName,
                      }
                    : null
                }
                department={formData.supervisor.subBidang}
                isPlnip={entity === "PLNIP"}
                entity={entity}
                isSameBulkMenu={formData.sameBulkMenu[entity]}
              />
            </View>
          );
        })
      )}
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
    if (!formData.orderType) {
      setOrderType("detail");
    }
  }, []);

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView className="flex-1" bounces={false}>
        <View className="p-6">
          <Text className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Pilih Jenis Pesanan
          </Text>
          <Text className="mb-6 text-base font-medium text-slate-500">
            Pilih metode pemesanan yang sesuai dengan kebutuhan Anda
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
            <View>
              <Text className="text-2xl font-bold tracking-tight text-gray-900">
                Isi Menu
              </Text>
              <View className="space-y-4">
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
                  className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <Text
                    className={
                      formData.bulkOrder.menuName
                        ? "text-base font-medium text-gray-900"
                        : "text-base text-gray-400"
                    }
                  >
                    {formData.bulkOrder.menuName || "Pilih menu untuk semua"}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={22}
                    color="#64748B"
                  />
                </TouchableOpacity>
                <TextInput
                  className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-base text-gray-900 shadow-sm"
                  defaultValue={formData.bulkOrder.note}
                  onChangeText={(text) => updateBulkOrder({ note: text })}
                  placeholder="Catatan"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ) : (
            selectedEntities.map(({ entity, count }) => (
              <DetailOrderSection key={entity} entity={entity} count={count} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
