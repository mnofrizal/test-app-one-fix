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
  TextInput,
  Pressable,
  Keyboard,
  BackHandler,
} from "react-native";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useEmployeeStore } from "../store/employeeStore";

// Uncontrolled search input component to prevent re-renders
const SearchInput = forwardRef(({ onSearch }, ref) => {
  const [localValue, setLocalValue] = useState("");
  const timeoutRef = useRef(null);

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    reset: () => setLocalValue(""),
  }));

  const handleChangeText = useCallback(
    (text) => {
      setLocalValue(text);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onSearch(text);
      }, 300);
    },
    [onSearch]
  );

  return (
    <View className="border-b border-gray-200 bg-white p-3">
      <TextInput
        className="rounded-lg bg-gray-100 p-3 text-base"
        placeholder="Search by name..."
        value={localValue}
        onChangeText={handleChangeText}
        placeholderTextColor="#666"
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />
    </View>
  );
});

// Memoized employee item to prevent re-renders
const EmployeeItem = React.memo(({ item, onPress }) => (
  <Pressable
    className="mx-3 my-1 rounded-lg bg-white p-3"
    onPress={() => onPress(item)}
  >
    <View className="flex-row items-center">
      <View className="h-[45px] w-[45px] items-center justify-center rounded-full bg-blue-100">
        <Text className="text-base font-semibold text-blue-600">
          {item.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Text>
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-base font-medium text-black">{item.name}</Text>
        <Text className="mt-0.5 text-sm text-gray-600">
          {item.isAsman ? "Supervisor" : "Staff"}
        </Text>
      </View>
    </View>
  </Pressable>
));

// Main EmployeeSelector component
const EmployeeSelector = forwardRef(({ onSelect, isVisible, onClose }, ref) => {
  const bottomSheetRef = useRef(null);

  // Get employee data and state from store
  const employeesByDepartment = useEmployeeStore(
    (state) => state.employeesByDepartment
  );
  const fetchEmployees = useEmployeeStore((state) => state.fetchEmployees);
  const isLoading = useEmployeeStore((state) => state.isLoading);
  const error = useEmployeeStore((state) => state.error);

  const allEmployees = useMemo(
    () => Object.values(employeesByDepartment).flat(),
    [employeesByDepartment]
  );
  const [filteredData, setFilteredData] = useState([]);
  const searchInputRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // Prefetch data when component mounts
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Update filtered data when employees change or sheet becomes visible
  useEffect(() => {
    if (isVisible) {
      setFilteredData(allEmployees);
    }
  }, [allEmployees, isVisible]);

  // Reset search and data when sheet is dismissed
  const handleDismiss = useCallback(() => {
    searchInputRef.current?.reset();
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

  // Memoize search handler
  const handleSearch = useCallback(
    (text) => {
      const filtered = text
        ? allEmployees.filter((emp) =>
            emp.name.toLowerCase().includes(text.toLowerCase())
          )
        : allEmployees;
      setFilteredData(filtered);
    },
    [allEmployees]
  );

  // Memoize handlers
  const handleEmployeeSelect = useCallback(
    (employee) => {
      Keyboard.dismiss();
      onSelect(employee);
      handleDismiss();
    },
    [onSelect, handleDismiss]
  );

  // Memoize sheet change handler
  const handleSheetChange = useCallback(
    (index) => {
      if (index === -1) {
        handleDismiss();
      }
    },
    [handleDismiss]
  );

  // Memoize render item
  const renderItem = useCallback(
    ({ item }) => <EmployeeItem item={item} onPress={handleEmployeeSelect} />,
    [handleEmployeeSelect]
  );

  // Memoize key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

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

  // Handle loading and error states
  if (isVisible && isLoading && !allEmployees.length) {
    return (
      <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-white">
        <Text>Loading employees...</Text>
      </View>
    );
  }

  if (isVisible && error) {
    return (
      <View className="absolute bottom-0 left-0 right-0 top-0 items-center justify-center bg-white p-4">
        <Text className="text-center text-red-500">{error}</Text>
        <Pressable
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2"
          onPress={fetchEmployees}
        >
          <Text className="text-white">Retry</Text>
        </Pressable>
      </View>
    );
  }

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
              Select Employee
            </Text>
            <Text className="mt-1 text-sm text-gray-600">
              {filteredData.length} employees
            </Text>
          </View>
          <SearchInput ref={searchInputRef} onSearch={handleSearch} />
        </View>
        <View className="flex-1" style={{ marginTop: 150 }}>
          <BottomSheetFlashList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            estimatedItemSize={77}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>
      </View>
    </BottomSheet>
  );
});

export default EmployeeSelector;
