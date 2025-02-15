import React from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";

const sectionIcons = {
  basic: "clipboard-text",
  pic: "account-tie",
  supervisor: "account-supervisor",
  order: "food",
};

const SectionCard = ({ title, icon, children }) => (
  <View className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    {title && (
      <View className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-white px-5 py-4">
        <View className="flex-row items-center">
          <MaterialCommunityIcons name={icon} size={24} color="#4F46E5" />
          <Text className="ml-3 text-lg font-semibold text-gray-900">
            {title}
          </Text>
        </View>
      </View>
    )}
    <View className="p-5">{children}</View>
  </View>
);

const InfoRow = ({ label, value, icon }) => (
  <View className="mb-4 last:mb-0">
    <View className="mb-2 flex-row items-center">
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={18}
          color="#64748B"
          style={{ marginRight: 8 }}
        />
      )}
      <Text className="text-sm font-medium text-slate-500">{label}</Text>
    </View>
    <Text className="pl-7 text-base font-medium text-gray-900">{value}</Text>
  </View>
);

const OrderItemCard = ({ title, items, note }) => (
  <View className="mb-3 rounded-xl bg-slate-50 p-4 last:mb-0">
    <View className="mb-3 flex-row items-center justify-between border-b border-slate-200 pb-2">
      <View className="flex-row items-center">
        <MaterialCommunityIcons name="account" size={20} color="#4F46E5" />
        <Text className="ml-2 text-base font-semibold text-gray-900">
          {title}
        </Text>
      </View>
    </View>
    {items.map((item, index) => (
      <View key={index} className="mb-2 flex-row items-center">
        <MaterialCommunityIcons name="food" size={18} color="#64748B" />
        <Text className="ml-2 text-base text-gray-700">{item}</Text>
      </View>
    ))}
    {note && (
      <View className="mt-2 flex-row items-center">
        <MaterialCommunityIcons name="note-text" size={18} color="#64748B" />
        <Text className="ml-2 text-sm text-slate-500">{note}</Text>
      </View>
    )}
  </View>
);

export const SummaryStep = () => {
  const { formData } = useMealOrderStore();
  const selectedEntities = Object.entries(formData.selectedEntities)
    .filter(([_, isSelected]) => isSelected)
    .map(([entity]) => entity);

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="p-6">
        <View className="mb-6">
          <Text className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            Order Summary
          </Text>
          <Text className="text-base font-medium text-slate-500">
            Review your order details before submitting
          </Text>
        </View>

        {/* Basic Details */}
        <SectionCard title="Basic Information" icon="clipboard-text">
          <InfoRow
            label="Judul Pekerjaan"
            value={formData.judulPekerjaan}
            icon="file-document-outline"
          />
          <InfoRow
            label="Tipe Pesanan"
            value={formData.category}
            icon="clock-outline"
          />
          <InfoRow
            label="Drop Point"
            value={formData.dropPoint}
            icon="map-marker"
          />
        </SectionCard>

        {/* PIC Details */}
        <SectionCard title="PIC Information" icon="account-tie">
          <InfoRow label="Name" value={formData.pic.name} icon="account" />
          <InfoRow
            label="Phone"
            value={formData.pic.nomorHp || "Not provided"}
            icon="phone"
          />
        </SectionCard>

        {/* Supervisor Details */}
        <SectionCard title="Supervisor Information" icon="account-supervisor">
          <InfoRow
            label="Name"
            value={formData.supervisor.name}
            icon="account-tie"
          />
          <InfoRow
            label="Phone"
            value={formData.supervisor.nomorHp || "Not provided"}
            icon="phone"
          />
          <InfoRow
            label="Sub Bidang"
            value={formData.supervisor.subBidang}
            icon="office-building"
          />
        </SectionCard>

        {/* Order Details */}
        <SectionCard title="Order Details" icon="food">
          {formData.orderType === "bulk" ? (
            <View>
              <InfoRow
                label="Menu untuk semua"
                value={
                  formData.bulkOrder.menuName || formData.bulkOrder.menuItemId
                }
                icon="food-variant"
              />
              {formData.bulkOrder.note && (
                <InfoRow
                  label="Catatan"
                  value={formData.bulkOrder.note}
                  icon="note-text"
                />
              )}
              <View className="mt-4 rounded-xl bg-slate-50 p-4">
                <Text className="mb-2 text-sm font-semibold text-slate-600">
                  Selected Entities
                </Text>
                {selectedEntities.map((entity) => (
                  <Text key={entity} className="text-base text-gray-900">
                    • {entity}: {formData.entityCounts[entity]} orang
                  </Text>
                ))}
              </View>
            </View>
          ) : (
            selectedEntities.map((entity) => {
              const orders = formData.employeeOrders.filter(
                (o) => o.entity === entity
              );
              return (
                <View key={entity} className="mb-6 last:mb-0">
                  <View className="mb-3 border-b border-slate-100 pb-2">
                    <Text className="text-lg font-semibold text-gray-900">
                      {entity}
                    </Text>
                  </View>
                  {orders.map((order, index) => (
                    <View
                      key={`${entity}-${index}`}
                      className="mb-4 rounded-xl bg-slate-50 p-4 last:mb-0"
                    >
                      <InfoRow label="Pegawai" value={order.employeeName} />
                      <InfoRow
                        label="Menu"
                        value={
                          order.items[0]?.menuName || order.items[0]?.menuItemId
                        }
                      />
                      {order.note && (
                        <InfoRow label="Catatan" value={order.note} />
                      )}
                    </View>
                  ))}
                </View>
              );
            })
          )}
        </SectionCard>
      </View>
    </ScrollView>
  );
};
