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
import { mockUsers } from "../../constants/mockUsers";
import DropPointSheet from "./DropPointSheet";
import UserSelectSheet from "./UserSelectSheet";
import DepartmentSheet from "./DepartmentSheet";

export const DetailStep = () => {
  const { formData, updateFormData, updatePIC, updateSupervisor } =
    useMealOrderStore();
  const [dropPointVisible, setDropPointVisible] = useState(false);
  const [picSheetVisible, setPicSheetVisible] = useState(false);
  const [supervisorSheetVisible, setSupervisorSheetVisible] = useState(false);
  const [departmentSheetVisible, setDepartmentSheetVisible] = useState(false);

  const categories = ["Sarapan", "Makan Siang", "Makan Malam", "Snack"];

  return (
    <ScrollView className="flex-1">
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
                    formData.category === category
                      ? "bg-blue-500"
                      : "bg-gray-100"
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
            <TouchableOpacity
              onPress={() => setPicSheetVisible(true)}
              className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            >
              <Text
                className={
                  formData.pic.name ? "text-gray-900" : "text-gray-400"
                }
              >
                {formData.pic.name || "Select PIC Name"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Supervisor Information */}
        <View className="mb-4">
          <Text className="mb-3 text-sm font-medium text-gray-800">
            Supervisor Information
          </Text>
          <View className="space-y-3">
            <TouchableOpacity
              onPress={() => setSupervisorSheetVisible(true)}
              className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            >
              <Text
                className={
                  formData.supervisor.name ? "text-gray-900" : "text-gray-400"
                }
              >
                {formData.supervisor.name || "Select Supervisor"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDepartmentSheetVisible(true)}
              className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5"
            >
              <Text
                className={
                  formData.supervisor.subBidang
                    ? "text-gray-900"
                    : "text-gray-400"
                }
              >
                {formData.supervisor.subBidang || "Select Department"}
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>
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

        {/* Bottom Sheets */}
        <DropPointSheet
          visible={dropPointVisible}
          onClose={() => setDropPointVisible(false)}
          onSelect={(point) => updateFormData({ dropPoint: point })}
          selected={formData.dropPoint}
        />

        <UserSelectSheet
          visible={picSheetVisible}
          onClose={() => setPicSheetVisible(false)}
          onSelect={(user) => {
            // Update PIC info
            updatePIC({
              name: user.name,
              nomorHp: user.nomorHp || "",
            });

            // Find and set supervisor from the same department
            const departmentUsers = mockUsers[user.department];
            const supervisor = departmentUsers.find((u) => u.isAsman);
            if (supervisor) {
              updateSupervisor({
                name: supervisor.name,
                nomorHp: supervisor.nomorHp || "",
                subBidang: user.department,
              });
            }
          }}
          selected={formData.pic.name ? { name: formData.pic.name } : null}
          title="Select PIC"
        />

        <UserSelectSheet
          visible={supervisorSheetVisible}
          onClose={() => setSupervisorSheetVisible(false)}
          onSelect={(user) => {
            updateSupervisor({
              name: user.name,
              nomorHp: user.nomorHp || "",
              subBidang: user.department,
            });
            // Also update the department when supervisor is selected
            updateSupervisor({ subBidang: user.department });
          }}
          selected={
            formData.supervisor.name ? { name: formData.supervisor.name } : null
          }
          title="Select Supervisor"
          supervisorsOnly={true}
        />

        <DepartmentSheet
          visible={departmentSheetVisible}
          onClose={() => setDepartmentSheetVisible(false)}
          onSelect={(department) => updateSupervisor({ subBidang: department })}
          selected={formData.supervisor.subBidang}
        />
      </View>
    </ScrollView>
  );
};
