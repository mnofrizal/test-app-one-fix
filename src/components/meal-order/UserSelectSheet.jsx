import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet from "../BottomSheet";
import { useEmployeeStore } from "../../store/employeeStore";

const UserSelectSheet = ({ visible, onClose, onSelect, selected, title }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { employeesByDepartment } = useEmployeeStore();

  // Get all employees from all departments
  const getAllEmployees = () => {
    const allEmployees = [];
    Object.entries(employeesByDepartment).forEach(([department, employees]) => {
      employees.forEach((employee) => {
        if (!employee.isAsman) {
          // Exclude ASMAN from the list
          allEmployees.push({
            ...employee,
            department, // Add department info to employee
          });
        }
      });
    });
    return allEmployees;
  };

  const employees = getAllEmployees();
  const filteredEmployees = searchQuery
    ? employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : employees;

  const handleSelect = (employee) => {
    onSelect(employee);
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["75%"]}>
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-gray-100 bg-white px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onClose} className="rounded-full p-2">
              <MaterialCommunityIcons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">
              {title || "Select User"}
            </Text>
            <View className="h-8 w-8" />
          </View>
        </View>

        {/* Search Input */}
        <View className="border-b border-gray-100 p-4">
          <View className="flex-row items-center rounded-lg bg-gray-50 px-3 py-2">
            <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />
            <TextInput
              className="ml-2 flex-1 text-base text-gray-900"
              placeholder="Search users..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* User List */}
        <ScrollView className="flex-1">
          <View className="p-4">
            <View className="space-y-2">
              {filteredEmployees.map((employee) => (
                <TouchableOpacity
                  key={employee.id}
                  onPress={() => handleSelect(employee)}
                  className={`flex-row items-center justify-between rounded-xl border p-4 ${
                    selected?.name === employee.name
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-1">
                    <Text
                      className={`text-base font-medium ${
                        selected?.name === employee.name
                          ? "text-indigo-700"
                          : "text-gray-900"
                      }`}
                    >
                      {employee.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {employee.department}
                    </Text>
                    {employee.nomorHp && (
                      <Text className="mt-1 text-sm text-gray-500">
                        {employee.nomorHp}
                      </Text>
                    )}
                  </View>
                  {selected?.name === employee.name && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#4F46E5"
                    />
                  )}
                </TouchableOpacity>
              ))}

              {filteredEmployees.length === 0 && searchQuery && (
                <View className="items-center py-8">
                  <Text className="text-gray-500">No users found</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

export default UserSelectSheet;
