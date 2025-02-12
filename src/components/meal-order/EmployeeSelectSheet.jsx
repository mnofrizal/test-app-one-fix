import React, { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";
import { mockUsers } from "../../constants/mockUsers";

const EmployeeSelectSheet = ({
  visible,
  onClose,
  onSelect,
  selected,
  department,
  isPlnip,
}) => {
  const bottomSheetRef = useRef(null);
  const inputRef = useRef(null);
  const inputTextRef = useRef("");
  const [searchText, setSearchText] = useState("");
  const nameInputRef = useRef("");

  // Get department employees or show empty input for non-PLNIP
  const employees = useMemo(() => {
    if (!isPlnip || !department) return [];
    return mockUsers[department]?.filter((user) => !user.isAsman) || [];
  }, [department, isPlnip]);

  const filteredEmployees = useMemo(() => {
    if (!inputTextRef.current) return employees;
    const searchLower = inputTextRef.current.toLowerCase();
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchLower)
    );
  }, [searchText, employees]);

  // Different snap points for keyboard visible/hidden states
  const snapPoints = useMemo(() => ["50%", "85%"], []);

  if (!isPlnip) {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        visible={visible}
        onClose={onClose}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        footerComponent={() => (
          <View
            className="border-t border-gray-100 bg-white p-4"
            style={{
              paddingBottom: Platform.OS === "ios" ? 34 : 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (nameInputRef.current) {
                  onClose();
                }
              }}
              className="rounded-lg bg-blue-600 py-3"
            >
              <Text className="text-center text-base font-medium text-white">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        )}
      >
        <View className="flex-1">
          <View className="border-b border-gray-100 bg-white px-4 pb-4">
            <Text className="mb-4 text-xl font-semibold text-gray-800">
              Input Employee Name
            </Text>
          </View>
          <View className="p-4">
            <View>
              <Text className="mb-2 text-sm font-medium text-gray-700">
                Name
              </Text>
              <BottomSheetTextInput
                ref={nameInputRef}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
                placeholder="Enter employee name"
                placeholderTextColor="#9CA3AF"
                defaultValue={selected?.name || ""}
                onChangeText={(text) => {
                  nameInputRef.current = text;
                  onSelect({
                    name: text,
                    id: Date.now().toString(),
                  });
                }}
                onSubmitEditing={() => {
                  if (nameInputRef.current) {
                    onClose();
                  }
                }}
                returnKeyType="done"
              />
            </View>
          </View>
        </View>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["65%", "85%"]}
    >
      <View className="flex-1">
        <View className="border-b border-gray-100 bg-white px-4 pb-4">
          <Text className="mb-4 text-xl font-semibold text-gray-800">
            Select Employee
          </Text>

          <View className="rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              ref={inputRef}
              placeholder="Search employee"
              className="py-2.5 text-base text-gray-900"
              onChangeText={(text) => {
                inputTextRef.current = text;
                setSearchText(text);
              }}
              defaultValue={inputTextRef.current}
            />
          </View>
        </View>

        <View className="flex-1 p-4">
          <View className="space-y-2">
            {filteredEmployees.map((employee) => (
              <TouchableOpacity
                key={employee.id}
                onPress={() => {
                  onSelect(employee);
                  onClose();
                }}
                className={`rounded-lg border p-4 ${
                  selected?.id === employee.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-base ${
                      selected?.id === employee.id
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {employee.name}
                  </Text>
                  {selected?.id === employee.id && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#2563EB"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default EmployeeSelectSheet;
