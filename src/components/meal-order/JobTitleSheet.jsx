import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const JobTitleSheet = ({ visible, onClose, onSave, initialValue = "" }) => {
  const bottomSheetRef = useRef(null);
  const titleRef = useRef(initialValue);
  const [isValid, setIsValid] = useState(initialValue.trim() !== "");

  const handleTextChange = useCallback((text) => {
    titleRef.current = text;
    setIsValid(text.trim() !== "");
  }, []);

  // Reset when sheet becomes invisible
  useEffect(() => {
    if (!visible) {
      titleRef.current = "";
      setIsValid(false);
    } else {
      // Reset to initial value when sheet becomes visible
      titleRef.current = initialValue;
      setIsValid(initialValue.trim() !== "");
    }
  }, [visible, initialValue]);

  const handleSave = useCallback(() => {
    if (titleRef.current.trim()) {
      onSave(titleRef.current);
      bottomSheetRef.current?.dismiss();
    }
  }, [onSave]);

  // Provide different snap points for keyboard visible/hidden states
  const inputRef = useRef(null);
  const snapPoints = useMemo(() => ["65%", "95%"], []);

  // Focus input after animation
  useEffect(() => {
    if (visible) {
      // Wait for bottom sheet animation to complete
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      visible={visible}
      onClose={onClose}
      snapPoints={snapPoints}
    >
      <View className="relative flex-1">
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
            <TouchableOpacity
              onPress={handleSave}
              disabled={!isValid}
              className={`rounded-lg px-3 py-2 ${
                isValid ? "bg-indigo-50" : "opacity-50"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isValid ? "text-indigo-600" : "text-gray-400"
                }`}
              >
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Content */}
        <View className="p-4 pb-20">
          <View className="space-y-6">
            <View className="space-y-4">
              <View className="space-y-2">
                <Text className="text-sm text-gray-500">
                  Masukkan judul atau pilih saran di bawah
                </Text>
              </View>

              <View className="rounded-xl bg-gray-100 p-3">
                <BottomSheetTextInput
                  className="rounded-lg bg-white px-4 py-2.5 text-lg shadow-lg"
                  defaultValue={titleRef.current}
                  onChangeText={handleTextChange}
                  placeholder="Masukkan judul pekerjaan..."
                  placeholderTextColor="#9CA3AF"
                  autoCapitalize="words"
                  ref={inputRef}
                />
              </View>

              <View className="mt-4">
                <View className="flex-row flex-wrap gap-2">
                  {["Pemeliharaan", "Pekerjaan", "OH", "Lembur"].map(
                    (title) => (
                      <TouchableOpacity
                        key={title}
                        onPress={() => {
                          titleRef.current = title;
                          handleTextChange(`${title} `);
                          inputRef.current?.setNativeProps({ text: title });
                        }}
                        className="rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm"
                        style={{
                          elevation: 1,
                        }}
                      >
                        <Text className="text-sm font-medium text-gray-700">
                          {title}
                        </Text>
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
};

export default JobTitleSheet;
