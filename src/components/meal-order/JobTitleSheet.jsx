import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";

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
      bottomSheetRef.current?.forceClose();
    }
  }, [onSave]);

  // Provide different snap points for keyboard visible/hidden states
  const inputRef = useRef(null);
  const snapPoints = useMemo(() => ["55%"], []);

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
        {/* Fixed Header */}
        <View className="border-b border-gray-100 bg-white px-4">
          <Text className="mb-4 text-xl font-semibold text-gray-800">
            Judul Pekerjaan
          </Text>
        </View>

        {/* Form - Added bottom padding to prevent content being hidden behind fixed button */}
        <View className="p-4 pb-20">
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Masukkan judul pekerjaan yang akan dilakukan
            </Text>
            <BottomSheetTextInput
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
              defaultValue={titleRef.current}
              onChangeText={handleTextChange}
              placeholder="Contoh: Meeting Project A"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              ref={inputRef}
            />
          </View>
        </View>

        {/* Save Button - Fixed at bottom */}
        <View className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-4 py-4">
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isValid}
            className={`w-full rounded-lg py-3 ${
              isValid ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-center font-medium text-white">Simpan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

export default JobTitleSheet;
