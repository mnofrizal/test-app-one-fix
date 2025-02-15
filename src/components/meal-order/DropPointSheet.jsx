import React, { useState, useMemo, useCallback, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";

const dropPoints = [
  "Kantor Pusat Lt. 1",
  "Kantor Pusat Lt. 2",
  "Kantor Pusat Lt. 3",
  "Gedung B Lt. 1",
  "Gedung B Lt. 2",
  "Gedung C Lt. 1",
  "Gedung C Lt. 2",
  "Ruang Meeting Utama",
  "Lobby Utama",
];

const DropPointSheet = ({ visible, onClose, onSelect, selected }) => {
  const inputRef = useRef(null);
  const inputTextRef = useRef("");
  const [searchText, setSearchText] = useState("");

  const filteredPoints = useMemo(() => {
    if (!inputTextRef.current) return dropPoints;
    const searchLower = inputTextRef.current.toLowerCase();
    return dropPoints.filter((point) =>
      point.toLowerCase().includes(searchLower)
    );
  }, [searchText]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%", "85%", "95%"]}
    >
      <View className="flex-1">
        {/* Header */}
        <View className="border-b border-gray-100 bg-white px-4 pb-4 pt-2">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.dismiss()}
              className="rounded-full p-2"
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#64748B"
                />
              </View>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">
              Judul Pekerjaan
            </Text>
            <TouchableOpacity className={`rounded-lgpx-3 py-2`}>
              <Text className={`text-sm font-medium text-indigo-600`}>
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
          {/* Search Input */}
          <View className="mt-3 rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              ref={inputRef}
              placeholder="Search drop point"
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
            {/* Add New Option - only show when there are no matches */}
            {inputTextRef.current && filteredPoints.length === 0 && (
              <TouchableOpacity
                onPress={() => {
                  onSelect(searchText);
                  onClose();
                }}
                className="flex-row items-center justify-between rounded-lg border border-blue-500 bg-blue-50 p-4"
              >
                <View>
                  <Text className="text-base text-blue-600">
                    Tambahkan "{inputTextRef.current}"
                  </Text>
                  <Text className="text-sm text-gray-500">
                    sebagai drop point baru
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="plus-circle"
                  size={20}
                  color="#2563EB"
                />
              </TouchableOpacity>
            )}

            {/* Filtered Options */}
            {filteredPoints.map((point) => (
              <TouchableOpacity
                key={point}
                onPress={() => {
                  onSelect(point);
                  onClose();
                }}
                className={`flex-row items-center justify-between rounded-lg border p-4 ${
                  selected === point
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Text
                  className={`text-base ${
                    selected === point ? "text-blue-600" : "text-gray-800"
                  }`}
                >
                  {point}
                </Text>
                {selected === point && (
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

export default DropPointSheet;
