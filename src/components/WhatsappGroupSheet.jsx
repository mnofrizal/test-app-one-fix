import React, { useCallback, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  StyleSheet,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const groups = [
  {
    id: "admin",
    name: "Grup Admin",
  },
  {
    id: "kitchen",
    name: "Grup Dapur",
  },
  {
    id: "notif",
    name: "Grup Notifikasi",
  },
  {
    id: "bola",
    name: "Grup Bola",
  },
];

const WhatsappGroupSheet = ({
  onSelect,
  isVisible,
  onClose,
  selectedGroup,
}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "70%"], []);

  // Handle back press
  useEffect(() => {
    if (!isVisible) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        handleDismiss();
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isVisible, onClose]);

  const handleDismiss = useCallback(() => {
    onClose();
    bottomSheetRef.current?.close();
  }, [onClose]);

  const handleSheetChange = useCallback(
    (index) => {
      if (index === -1) {
        handleDismiss();
      }
    },
    [handleDismiss]
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }) => {
      const isSelected = selectedGroup?.id === item.id;
      return (
        <TouchableOpacity
          onPress={() => {
            onSelect(item);
            handleDismiss();
          }}
          className={`mx-3 my-1 flex-row items-center justify-between rounded-lg border p-4 ${
            isSelected
              ? "border-green-600 bg-green-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <Text
            className={`text-base ${
              isSelected ? "text-green-600 font-medium" : "text-gray-800"
            }`}
          >
            {item.name}
          </Text>
          {isSelected ? (
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#4CAF50"
            />
          ) : (
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#666"
            />
          )}
        </TouchableOpacity>
      );
    },
    [onSelect, handleDismiss, selectedGroup]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      index={isVisible ? 1 : -1}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
    >
      <View className="flex-1">
        <View className="absolute left-0 right-0 top-0 z-10 bg-white shadow-sm">
          <View className="p-4">
            <Text className="text-xl font-semibold text-black">
              Select Group
            </Text>
          </View>
        </View>
        <View className="flex-1" style={{ marginTop: 70 }}>
          <BottomSheetFlashList
            data={groups}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            estimatedItemSize={77}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>
      </View>
    </BottomSheet>
  );
};

export default WhatsappGroupSheet;
