import React, { useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";
import { mockUsers } from "../../constants/mockUsers";

// Get all department names from mockUsers
const departments = Object.keys(mockUsers);

const DepartmentSheet = ({ visible, onClose, onSelect, selected }) => {
  const inputRef = useRef(null);
  const inputTextRef = useRef("");
  const [searchText, setSearchText] = useState("");

  const filteredDepartments = useMemo(() => {
    if (!inputTextRef.current) return departments;
    const searchLower = inputTextRef.current.toLowerCase();
    return departments.filter((dept) =>
      dept.toLowerCase().includes(searchLower)
    );
  }, [searchText]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%", "85%", "95%"]}
    >
      <View className="flex-1">
        {/* Fixed Header */}
        <View className="border-b border-gray-100 bg-white px-4 pb-4">
          <Text className="mb-4 text-xl font-semibold text-gray-800">
            Select Department
          </Text>

          {/* Search Input */}
          <View className="rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              ref={inputRef}
              placeholder="Search department"
              className="py-2.5 text-base text-gray-900"
              onChangeText={(text) => {
                inputTextRef.current = text;
                setSearchText(text);
              }}
              defaultValue={inputTextRef.current}
            />
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="space-y-2 p-4">
            {filteredDepartments.map((department) => (
              <TouchableOpacity
                key={department}
                onPress={() => {
                  onSelect(department);
                  onClose();
                }}
                className={`flex-row items-center justify-between rounded-lg border p-4 ${
                  selected === department
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`text-base ${
                    selected === department ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {department}
                </Text>
                {selected === department && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#2563EB"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

export default DepartmentSheet;
