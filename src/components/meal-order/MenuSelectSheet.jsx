import React, { useState, useMemo, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";
import { mockMenus } from "../../constants/mockMenus";

const MenuSelectSheet = ({ visible, onClose, onSelect, selected }) => {
  const inputRef = useRef(null);
  const inputTextRef = useRef("");
  const [searchText, setSearchText] = useState("");
  const menuSearchRef = useRef(null);

  const filteredMenus = useMemo(() => {
    if (!inputTextRef.current) return mockMenus;
    const searchLower = inputTextRef.current.toLowerCase();
    return mockMenus.filter((menu) =>
      menu.name.toLowerCase().includes(searchLower)
    );
  }, [searchText]);

  // Menu categories for readability
  const menuCategories = {
    HEAVY_MEAL: "Heavy Meal",
    SNACK: "Snack",
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["65%", "85%"]}
    >
      <View className="flex-1">
        <View className="border-b border-gray-100 bg-white px-4 pb-4">
          <Text className="mb-4 text-xl font-semibold text-gray-800">
            Select Menu
          </Text>

          <View className="rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              ref={inputRef}
              placeholder="Search menu"
              className="py-2.5 text-base text-gray-900"
              onChangeText={(text) => {
                inputTextRef.current = text;
                setSearchText(text);
              }}
              defaultValue={searchText}
            />
          </View>
        </View>

        <View className="flex-1 p-4">
          <View className="space-y-2">
            {filteredMenus.map((menu) => (
              <TouchableOpacity
                key={menu.id}
                onPress={() => {
                  onSelect(menu);
                  onClose();
                }}
                className={`rounded-lg border p-4 ${
                  selected?.id === menu.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
                disabled={!menu.isAvailable}
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text
                      className={`text-base ${
                        !menu.isAvailable
                          ? "text-gray-400"
                          : selected?.id === menu.id
                          ? "text-blue-600"
                          : "text-gray-800"
                      }`}
                    >
                      {menu.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {menuCategories[menu.category]}
                    </Text>
                  </View>
                  {selected?.id === menu.id ? (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#2563EB"
                    />
                  ) : !menu.isAvailable ? (
                    <Text className="text-sm text-red-500">Not Available</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default MenuSelectSheet;
