import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";
import DropPointSheet from "./DropPointSheet";

export const DetailStep = () => {
  const { formData, updateFormData, updatePIC, updateSupervisor } =
    useMealOrderStore();
  const [dropPointVisible, setDropPointVisible] = useState(false);
  const categories = ["Sarapan", "Makan Siang", "Makan Malam", "Snack"];

  return (
    <View className="p-4">
      <Text className="mb-4 text-lg font-semibold text-gray-800">
        Order Details
      </Text>

      {/* Category Selection */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">
          Tipe Pesanan
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => updateFormData({ category })}
                className={`mr-2 rounded-full px-4 py-2 ${
                  formData.category === category ? "bg-blue-500" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    formData.category === category
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Judul Pekerjaan */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">
          Judul Pekerjaan
        </Text>
        <TextInput
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
          value={formData.judulPekerjaan}
          onChangeText={(text) => updateFormData({ judulPekerjaan: text })}
          placeholder="Masukkan judul pekerjaan"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* PIC Information */}
      <View className="mb-4">
        <Text className="mb-3 text-sm font-medium text-gray-800">
          PIC Information
        </Text>
        <View className="space-y-3">
          <TextInput
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            value={formData.pic.name}
            onChangeText={(text) => updatePIC({ name: text })}
            placeholder="PIC Name"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            value={formData.pic.nomorHp}
            onChangeText={(text) => updatePIC({ nomorHp: text })}
            placeholder="PIC Phone Number"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Supervisor Information */}
      <View className="mb-4">
        <Text className="mb-3 text-sm font-medium text-gray-800">
          Supervisor Information
        </Text>
        <View className="space-y-3">
          <TextInput
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            value={formData.supervisor.name}
            onChangeText={(text) => updateSupervisor({ name: text })}
            placeholder="Supervisor Name"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            value={formData.supervisor.nomorHp}
            onChangeText={(text) => updateSupervisor({ nomorHp: text })}
            placeholder="Supervisor Phone Number"
            keyboardType="phone-pad"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            value={formData.supervisor.subBidang}
            onChangeText={(text) => updateSupervisor({ subBidang: text })}
            placeholder="Sub Bidang"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Drop Point */}
      <View className="mb-4">
        <Text className="mb-2 text-sm font-medium text-gray-700">
          Drop Point
        </Text>
        <TouchableOpacity
          onPress={() => setDropPointVisible(true)}
          className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5"
        >
          <Text
            className={formData.dropPoint ? "text-gray-900" : "text-gray-400"}
          >
            {formData.dropPoint || "Select drop point location"}
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>

      {/* Drop Point Bottom Sheet */}
      <DropPointSheet
        visible={dropPointVisible}
        onClose={() => setDropPointVisible(false)}
        onSelect={(point) => updateFormData({ dropPoint: point })}
        selected={formData.dropPoint}
      />
    </View>
  );
};
