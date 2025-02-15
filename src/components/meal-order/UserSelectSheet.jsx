import React, { useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";
import { mockUsers } from "../../constants/mockUsers";

// Flatten users array and add department info
const getAllUsers = (supervisorsOnly = false) => {
  return Object.entries(mockUsers).flatMap(([department, users]) =>
    users
      .filter((user) => !supervisorsOnly || user.isAsman)
      .map((user) => ({
        ...user,
        department,
      }))
  );
};

const UserSelectSheet = ({
  visible,
  onClose,
  onSelect,
  selected,
  title,
  supervisorsOnly = false,
}) => {
  const inputRef = useRef(null);

  const snapPoints = useMemo(() => ["65%", "95%"], []);
  const inputTextRef = useRef("");
  const [searchText, setSearchText] = useState("");

  const users = useMemo(() => getAllUsers(supervisorsOnly), [supervisorsOnly]);

  const filteredUsers = useMemo(() => {
    if (!inputTextRef.current) return users;
    const searchLower = inputTextRef.current.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower)
    );
  }, [searchText, users]);

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={snapPoints}>
      <View className="flex-1">
        {/* Fixed Header */}
        <View className="border-b border-gray-100 bg-white px-4 pb-4">
          <Text className="mb-4 text-xl font-semibold text-gray-800">
            {title || "Select User"}
          </Text>

          {/* Search Input */}
          <View className="rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              ref={inputRef}
              placeholder="Search by name or department"
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
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                onPress={() => {
                  onSelect(user);
                  onClose();
                }}
                className={`rounded-lg border p-4 ${
                  selected?.id === user.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text
                      className={`text-base ${
                        selected?.id === user.id
                          ? "text-blue-600"
                          : "text-gray-800"
                      }`}
                    >
                      {user.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {user.department}
                    </Text>
                  </View>
                  {selected?.id === user.id && (
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
        </ScrollView>
      </View>
    </BottomSheet>
  );
};

export default UserSelectSheet;
