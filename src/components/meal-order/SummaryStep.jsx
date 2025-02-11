import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useMealOrderStore } from "../../store/mealOrderStore";

const SectionCard = ({ title, children }) => (
  <View className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
    {title && <Text className="mb-3 font-medium text-gray-800">{title}</Text>}
    {children}
  </View>
);

const InfoRow = ({ label, value }) => (
  <View className="mb-2">
    <Text className="text-sm text-gray-600">{label}</Text>
    <Text className="text-base text-gray-800">{value}</Text>
  </View>
);

export const SummaryStep = () => {
  const { formData } = useMealOrderStore();
  const selectedEntities = Object.entries(formData.selectedEntities)
    .filter(([_, isSelected]) => isSelected)
    .map(([entity]) => entity);

  return (
    <ScrollView className="flex-1">
      <View className="p-4">
        <Text className="mb-4 text-lg font-semibold text-gray-800">
          Order Summary
        </Text>

        {/* Basic Details */}
        <SectionCard>
          <InfoRow label="Judul Pekerjaan" value={formData.judulPekerjaan} />
          <InfoRow label="Tipe Pesanan" value={formData.category} />
          <InfoRow label="Drop Point" value={formData.dropPoint} />
        </SectionCard>

        {/* PIC Details */}
        <SectionCard title="PIC Details">
          <InfoRow label="Name" value={formData.pic.name} />
          <InfoRow label="Phone" value={formData.pic.nomorHp} />
        </SectionCard>

        {/* Supervisor Details */}
        <SectionCard title="Supervisor Details">
          <InfoRow label="Name" value={formData.supervisor.name} />
          <InfoRow label="Phone" value={formData.supervisor.nomorHp} />
          <InfoRow label="Sub Bidang" value={formData.supervisor.subBidang} />
        </SectionCard>

        {/* Order Details */}
        <SectionCard title="Order Details">
          {formData.orderType === "bulk" ? (
            <View>
              <InfoRow
                label="Menu untuk semua"
                value={formData.bulkOrder.menuItemId}
              />
              {formData.bulkOrder.note && (
                <InfoRow label="Catatan" value={formData.bulkOrder.note} />
              )}
            </View>
          ) : (
            selectedEntities.map((entity) => {
              const order = formData.employeeOrders.find(
                (o) => o.entity === entity
              );
              return (
                <View key={entity} className="mb-4 last:mb-0">
                  <Text className="mb-2 font-medium text-gray-800">
                    {entity}
                  </Text>
                  <View className="space-y-2">
                    <InfoRow label="Pegawai" value={order?.employeeName} />
                    <InfoRow label="Menu" value={order?.items[0]?.menuItemId} />
                    {order?.note && (
                      <InfoRow label="Catatan" value={order.note} />
                    )}
                  </View>
                </View>
              );
            })
          )}
        </SectionCard>
      </View>
    </ScrollView>
  );
};
