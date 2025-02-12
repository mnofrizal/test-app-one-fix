import React, { useRef, useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";

const CustomPICSheet = ({ visible, onClose, onSave, initialData = {} }) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const nameRef = useRef(initialData.name || "");
  const phoneRef = useRef(initialData.nomorHp || "");
  const [isValid, setIsValid] = useState(
    nameRef.current.trim() !== "" && phoneRef.current.trim() !== ""
  );

  const handleSave = () => {
    onSave({
      name: nameRef.current,
      nomorHp: phoneRef.current,
    });
    onClose();
  };

  const validateInputs = () => {
    setIsValid(nameRef.current.trim() !== "" && phoneRef.current.trim() !== "");
  };

  // Handle keyboard show/hide
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setIsKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Dynamic snap points based on keyboard visibility
  const snapPoints = useMemo(
    () => [isKeyboardVisible ? "68%" : "42%"],
    [isKeyboardVisible]
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={snapPoints}>
      <View className="relative flex-1">
        {/* Fixed Header */}
        <View className="border-b border-gray-100 bg-white px-4">
          <Text className="mb-4 text-xl font-semibold text-gray-800">
            Custom PIC Information
          </Text>
        </View>

        {/* Form - Added bottom padding to prevent content being hidden behind fixed button */}
        <View className="p-4 pb-20">
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Name</Text>
            <BottomSheetTextInput
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
              defaultValue={nameRef.current}
              onChangeText={(text) => {
                nameRef.current = text;
                validateInputs();
              }}
              placeholder="Enter name"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">
              Phone Number
            </Text>
            <BottomSheetTextInput
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
              defaultValue={phoneRef.current}
              onChangeText={(text) => {
                phoneRef.current = text;
                validateInputs();
              }}
              placeholder="Enter phone number"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
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
            <Text className="text-center font-medium text-white">Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

export default CustomPICSheet;
