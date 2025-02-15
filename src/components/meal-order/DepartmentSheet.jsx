import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "../BottomSheet";
import { useEmployeeStore } from "../../store/employeeStore";

const DepartmentSheet = ({ visible, onClose, onSelect, selected }) => {
  const { employeesByDepartment, setSelectedDepartment } = useEmployeeStore();
  const departments = Object.keys(employeesByDepartment);

  const handleSelect = (department) => {
    setSelectedDepartment(department);
    onSelect(department);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["75%"]}>
      <View className="flex-1">
        <View className="border-b border-gray-100 bg-white px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose} className="rounded-full p-2">
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">
              Select Department
            </Text>
            <View className="h-8 w-8" />
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="space-y-2">
            {departments.map((department) => {
              const supervisor = employeesByDepartment[department].find(
                (emp) => emp.isAsman
              );
              return (
                <TouchableOpacity
                  key={department}
                  onPress={() => handleSelect(department)}
                  className={`flex-row items-center justify-between rounded-xl border p-4 ${
                    selected === department
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`mb-1 text-base font-medium ${
                        selected === department
                          ? "text-indigo-700"
                          : "text-gray-900"
                      }`}
                    >
                      {department}
                    </Text>
                    {supervisor && (
                      <Text className="text-sm text-gray-500">
                        ASMAN: {supervisor.name}
                      </Text>
                    )}
                  </View>
                  {selected === department && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#4F46E5"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

export default DepartmentSheet;
