import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  BackHandler,
  TextInput,
} from "react-native";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEmployeeStore } from "../store/employeeStore";

// Uncontrolled search input component to prevent re-renders
const SearchInput = forwardRef(({ onSearch }, ref) => {
  const inputRef = useRef(null);
  const [localValue, setLocalValue] = useState("");

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    reset: () => setLocalValue(""),
  }));

  const handleChangeText = useCallback(
    (text) => {
      setLocalValue(text);
      onSearch(text);
    },
    [onSearch]
  );

  return (
    <View className="border-b border-gray-200 bg-white p-3 px-0">
      <TextInput
        ref={inputRef}
        placeholder="Search sub bidang"
        className="rounded-lg bg-gray-100 p-3 text-base"
        onChangeText={handleChangeText}
        value={localValue}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />
    </View>
  );
});

// Main SubBidangSelector component
const SubBidangSelector = forwardRef(
  ({ onSelect, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);
    const searchInputRef = useRef(null);
    const snapPoints = useMemo(() => ["50%", "90%"], []);
    const [searchText, setSearchText] = useState("");

    // Get departments from employee store
    const employeesByDepartment = useEmployeeStore(
      (state) => state.employeesByDepartment
    );
    const departments = useMemo(
      () => Object.keys(employeesByDepartment),
      [employeesByDepartment]
    );

    // Filter departments based on search
    const filteredDepartments = useMemo(() => {
      if (!searchText) return departments;
      const searchLower = searchText.toLowerCase();
      return departments.filter((dept) =>
        dept.toLowerCase().includes(searchLower)
      );
    }, [departments, searchText]);

    // Reset search and close when sheet is dismissed
    const handleDismiss = useCallback(() => {
      searchInputRef.current?.reset();
      setSearchText("");
      onClose();
      bottomSheetRef.current?.close();
    }, [onClose]);

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
    }, [isVisible, onClose, handleDismiss]);

    // Memoize sheet change handler
    const handleSheetChange = useCallback(
      (index) => {
        if (index === -1) {
          handleDismiss();
        }
      },
      [handleDismiss]
    );

    // Memoize backdrop component
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

    // Render each department item
    const renderItem = useCallback(
      ({ item: department }) => {
        const employeeCount = employeesByDepartment[department]?.length || 0;
        const asman = employeesByDepartment[department]?.find(
          (emp) => emp.isAsman
        );

        return (
          <TouchableOpacity
            onPress={() => {
              onSelect(department);
              handleDismiss();
            }}
            className="mx-3 my-1 rounded-lg border border-gray-200 bg-white p-4"
          >
            <View>
              <Text className="text-base font-medium text-gray-800">
                {department}
              </Text>
              <View className="mt-1 flex-row items-center">
                <Text className="text-sm text-gray-500">
                  {employeeCount} employees
                </Text>
                {asman && (
                  <>
                    <Text className="mx-1.5 text-gray-400">•</Text>
                    <Text className="text-sm text-gray-500">
                      Supervisor: {asman.name}
                    </Text>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      },
      [employeesByDepartment, onSelect, handleDismiss]
    );

    // Add new department option when no matches found
    const ListHeaderComponent = useCallback(() => {
      if (!searchText || filteredDepartments.length > 0) return null;

      return (
        <TouchableOpacity
          onPress={() => {
            onSelect(searchText);
            handleDismiss();
          }}
          className="mx-3 my-1 flex-row items-center justify-between rounded-lg border border-blue-500 bg-blue-50 p-4"
        >
          <View>
            <Text className="text-base text-blue-600">
              Tambahkan "{searchText}"
            </Text>
            <Text className="text-sm text-gray-500">
              sebagai sub bidang baru
            </Text>
          </View>
          <MaterialCommunityIcons
            name="plus-circle"
            size={20}
            color="#2563EB"
          />
        </TouchableOpacity>
      );
    }, [searchText, filteredDepartments.length, handleDismiss, onSelect]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={isVisible ? 1 : -1}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
      >
        <View className="flex-1">
          <View className="absolute left-0 right-0 top-0 z-10 bg-white shadow-sm">
            <View className="p-4">
              <Text className="text-xl font-semibold text-black">
                Select Sub Bidang
              </Text>
              <SearchInput ref={searchInputRef} onSearch={setSearchText} />
            </View>
          </View>
          <View className="flex-1" style={{ marginTop: 130 }}>
            <BottomSheetFlashList
              data={filteredDepartments}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              estimatedItemSize={84}
              ListHeaderComponent={ListHeaderComponent}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>
        </View>
      </BottomSheet>
    );
  }
);

export default SubBidangSelector;
