import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
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
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

// Mock data remains the same
const mockEmployees = [
  {
    id: 1,
    name: "John Smith",
    department: "Engineering",
    role: "Senior Developer",
  },
  { id: 2, name: "Sarah Johnson", department: "Design", role: "UI Designer" },
  {
    id: 3,
    name: "Michael Brown",
    department: "Engineering",
    role: "Mobile Developer",
  },
  {
    id: 4,
    name: "Emma Wilson",
    department: "Marketing",
    role: "Marketing Manager",
  },
  {
    id: 5,
    name: "James Davis",
    department: "Engineering",
    role: "Backend Developer",
  },
  { id: 6, name: "Lisa Anderson", department: "HR", role: "HR Manager" },
  { id: 7, name: "David Lee", department: "Design", role: "Product Designer" },
  { id: 8, name: "Amy Chen", department: "Engineering", role: "QA Engineer" },
  {
    id: 9,
    name: "Robert Taylor",
    department: "Sales",
    role: "Sales Executive",
  },
  {
    id: 10,
    name: "Jennifer Martin",
    department: "Marketing",
    role: "Content Writer",
  },
];

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
        placeholder="Search by name or department..."
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
          {item.department} • {item.role}
        </Text>
      </View>
    </View>
  </Pressable>
));

// Wrap component with forwardRef
const EmployeeSelector = forwardRef(({ onSelect, isVisible, onClose }, ref) => {
  const [filteredData, setFilteredData] = useState(mockEmployees);
  const searchInputRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  // Reset search and data when sheet is dismissed
  const handleDismiss = useCallback(() => {
    setFilteredData(mockEmployees);
    searchInputRef.current?.reset();
    onClose();

    ref.current?.close();
  }, [onClose, ref]);

  // Handle back press
  useEffect(() => {
    if (!isVisible) return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        handleDismiss();
        // setTimeout(() => {
        //   ref.current?.close();
        // }, 0);
        return true;
      }
    );

    return () => backHandler.remove();
  }, [isVisible, onClose, ref]);

  // Memoize search handler
  const handleSearch = useCallback((text) => {
    const filtered = text
      ? mockEmployees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(text.toLowerCase()) ||
            emp.department.toLowerCase().includes(text.toLowerCase())
        )
      : mockEmployees;
    setFilteredData(filtered);
  }, []);

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

  return (
    <BottomSheet
      ref={ref}
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
        <View className="flex-1" style={{ marginTop: 116 }}>
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

const TestScreen = () => {
  const bottomSheetRef = useRef(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handlePress = useCallback(() => {
    setIsBottomSheetVisible(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setIsBottomSheetVisible(false);
  }, []);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 p-4">
        <Pressable className="rounded-lg bg-blue-500 p-4" onPress={handlePress}>
          <Text className="text-center text-white">
            {selectedEmployee ? selectedEmployee.name : "Select Employee"}
          </Text>
        </Pressable>

        <EmployeeSelector
          ref={bottomSheetRef}
          onSelect={setSelectedEmployee}
          isVisible={isBottomSheetVisible}
          onClose={handleDismiss}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default TestScreen;
