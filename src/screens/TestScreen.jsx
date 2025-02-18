import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
} from "react-native";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";

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
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
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
    style={styles.employeeItem}
    onPress={() => {
      Keyboard.dismiss();
      // Small delay to ensure keyboard is dismissed before selection
      setTimeout(() => {
        onPress(item);
      }, 50);
    }}
  >
    <View style={styles.employeeContent}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>
          {item.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </Text>
      </View>
      <View style={styles.employeeInfo}>
        <Text style={styles.employeeName}>{item.name}</Text>
        <Text style={styles.employeeDetails}>
          {item.department} • {item.role}
        </Text>
      </View>
    </View>
  </Pressable>
));

// Wrap component with forwardRef
const EmployeeSelector = forwardRef(({ onSelect }, ref) => {
  // Move search state outside of component to prevent re-renders
  const [filteredData, setFilteredData] = useState(mockEmployees);
  const searchInputRef = useRef(null);

  // Reset search and data when sheet is dismissed
  const handleDismiss = useCallback(() => {
    setFilteredData(mockEmployees);
    searchInputRef.current?.reset();
  }, []);

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
      onSelect(employee);
      ref?.current?.dismiss();
    },
    [onSelect]
  );

  // Memoize render item
  const renderItem = useCallback(
    ({ item }) => <EmployeeItem item={item} onPress={handleEmployeeSelect} />,
    [handleEmployeeSelect]
  );

  // Memoize separator
  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  // Memoize key extractor
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={["50%", "80%"]}
      keyboardBehavior="extend"
      enablePanDownToClose
      index={1}
      onDismiss={handleDismiss}
      keyboardBlurBehavior="none"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Select Employee</Text>
          <Text style={styles.subtitle}>{filteredData.length} employees</Text>
        </View>

        <SearchInput ref={searchInputRef} onSearch={handleSearch} />

        <BottomSheetFlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={ItemSeparator}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        />
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  searchContainer: {
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    fontSize: 16,
  },
  listContainer: {
    padding: 12,
  },
  employeeItem: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  employeeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarCircle: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: "#e0e0ff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4040ff",
  },
  employeeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  employeeDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  separator: {
    height: 8,
  },
});

const TestScreen = () => {
  const bottomSheetRef = useRef(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handlePress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      <Pressable
        style={{
          padding: 16,
          backgroundColor: "#007AFF",
          borderRadius: 8,
        }}
        onPress={handlePress}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          {selectedEmployee ? selectedEmployee.name : "Select Employee"}
        </Text>
      </Pressable>

      <EmployeeSelector ref={bottomSheetRef} onSelect={setSelectedEmployee} />
    </View>
  );
};

export default TestScreen;
