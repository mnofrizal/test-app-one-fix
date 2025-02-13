import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useMealOrderStore } from "../../store/mealOrderStore";

const SectionCard = ({ title, children }) => (
  <View className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    {title && (
      <View className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <Text className="text-lg font-semibold text-gray-900">{title}</Text>
      </View>
    )}
    <View className="p-5">{children}</View>
  </View>
);

const InfoRow = ({ label, value }) => (
  <View className="mb-3 last:mb-0">
    <Text className="mb-1 text-sm font-medium text-slate-500">{label}</Text>
    <Text className="text-base font-medium text-gray-900">{value}</Text>
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
        <Text className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          Order Summary
        </Text>
        <Text className="mb-6 text-base font-medium text-slate-500">
          Review your order details before submitting
        </Text>

        {/* Basic Details */}
        <SectionCard title="Basic Information">
          <InfoRow label="Judul Pekerjaan" value={formData.judulPekerjaan} />
          <InfoRow label="Tipe Pesanan" value={formData.category} />
          <InfoRow label="Drop Point" value={formData.dropPoint} />
        </SectionCard>

        {/* PIC Details */}
        <SectionCard title="PIC Information">
          <InfoRow label="Name" value={formData.pic.name} />
          <InfoRow
            label="Phone"
            value={formData.pic.nomorHp || "Not provided"}
          />
        </SectionCard>

        {/* Supervisor Details */}
        <SectionCard title="Supervisor Information">
          <InfoRow label="Name" value={formData.supervisor.name} />
          <InfoRow
            label="Phone"
            value={formData.supervisor.nomorHp || "Not provided"}
          />
          <InfoRow label="Sub Bidang" value={formData.supervisor.subBidang} />
        </SectionCard>

        {/* Order Details */}
        <SectionCard title="Order Details">
          {formData.orderType === "bulk" ? (
            <View>
              <InfoRow
                label="Menu untuk semua"
                value={
                  formData.bulkOrder.menuName || formData.bulkOrder.menuItemId
                }
              />
              {formData.bulkOrder.note && (
                <InfoRow label="Catatan" value={formData.bulkOrder.note} />
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
