import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useEmployeeStore } from "../store/employeeStore";
import { useMealOrderStore } from "../store/mealOrderStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TestGorhomSheet from "../components/TestGorhomSheet.jsx";

const TestScreen2 = () => {
  // Sheet visibility states
  const [employeeSheetVisible, setEmployeeSheetVisible] = useState(false);
  const [departmentSheetVisible, setDepartmentSheetVisible] = useState(false);
  const [asmanSheetVisible, setAsmanSheetVisible] = useState(false);
  // Search and selection states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedAsman, setSelectedAsman] = useState(null);

  // Store hooks
  const {
    fetchEmployees,
    employeesByDepartment,
    flattenedEmployees,
    isLoading,
  } = useEmployeeStore();

  const formData = useMealOrderStore((state) => state.formData);

  // Memoized data
  const departments = useMemo(
    () => Object.keys(employeesByDepartment),
    [employeesByDepartment]
  );

  const asmanList = useMemo(() => {
    return flattenedEmployees.filter((employee) => employee.isAsman);
  }, [flattenedEmployees]);

  const filteredEmployees = useMemo(() => {
    let filtered = flattenedEmployees;

    if (selectedDepartment) {
      filtered = filtered.filter(
        (employee) => employee.department === selectedDepartment
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((employee) =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery, flattenedEmployees, selectedDepartment]);

  // Callbacks
  const handleEmployeeOpen = useCallback(
    () => setEmployeeSheetVisible(true),
    []
  );
  const handleEmployeeClose = useCallback(
    () => setEmployeeSheetVisible(false),
    []
  );
  const handleEmployeeSelect = useCallback((employee) => {
    setSelectedEmployee(employee);
    setEmployeeSheetVisible(false);
  }, []);

  const handleDepartmentOpen = useCallback(
    () => setDepartmentSheetVisible(true),
    []
  );
  const handleDepartmentClose = useCallback(
    () => setDepartmentSheetVisible(false),
    []
  );
  const handleDepartmentSelect = useCallback((dept) => {
    setSelectedDepartment(dept);
    setDepartmentSheetVisible(false);
  }, []);

  const handleAsmanOpen = useCallback(() => setAsmanSheetVisible(true), []);
  const handleAsmanClose = useCallback(() => setAsmanSheetVisible(false), []);
  const handleAsmanSelect = useCallback((asman) => {
    setSelectedAsman(asman);
    setAsmanSheetVisible(false);
  }, []);

  // Fetch employees data when component mounts
  useEffect(() => {
    if (Object.keys(employeesByDepartment).length === 0) {
      fetchEmployees();
    }
  }, []);

  const renderMealOrders = useCallback(() => {
    const orders = formData.employeeOrders;
    if (!orders.length) return null;

    return (
      <View style={styles.ordersContainer}>
        <Text style={styles.ordersTitle}>Current Orders:</Text>
        {orders.map((order, index) => (
          <View key={index} style={styles.orderItem}>
            <Text>Employee: {order.employeeName}</Text>
            <Text>Entity: {order.entity}</Text>
            {order.items?.[0] && <Text>Menu: {order.items[0].menuName}</Text>}
          </View>
        ))}
      </View>
    );
  }, [formData.employeeOrders]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.buttonContainer}>
          <Button title="Select Employee" onPress={handleEmployeeOpen} />
          <View style={styles.buttonSpacer} />
          <Button title="Select Department" onPress={handleDepartmentOpen} />
          <View style={styles.buttonSpacer} />
          <Button title="Select Asman" onPress={handleAsmanOpen} />
          {selectedEmployee && (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedTitle}>Selected Employee:</Text>
              <Text>Name: {selectedEmployee.name}</Text>
              <Text>Department: {selectedEmployee.department}</Text>
              {selectedEmployee.nomorHp && (
                <Text>Phone: {selectedEmployee.nomorHp}</Text>
              )}
            </View>
          )}

          {selectedDepartment && (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedTitle}>Selected Department:</Text>
              <Text>{selectedDepartment}</Text>
            </View>
          )}

          {selectedAsman && (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedTitle}>Selected Asman:</Text>
              <Text>Name: {selectedAsman.name}</Text>
              <Text>Department: {selectedAsman.department}</Text>
            </View>
          )}

          {renderMealOrders()}
        </View>
      </ScrollView>

      {/* Employee Selection Sheet */}
      <TestGorhomSheet
        visible={employeeSheetVisible}
        onClose={handleEmployeeClose}
        onSelect={handleEmployeeSelect}
        data={filteredEmployees}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
        title="Select Employee"
      />

      {/* Department Selection Sheet */}
      <TestGorhomSheet
        visible={departmentSheetVisible}
        onClose={handleDepartmentClose}
        onSelect={handleDepartmentSelect}
        data={departments.map((dept) => ({ name: dept, department: dept }))}
        searchQuery=""
        onSearchChange={() => {}}
        title="Select Department"
      />

      {/* Asman Selection Sheet */}
      <TestGorhomSheet
        visible={asmanSheetVisible}
        onClose={handleAsmanClose}
        onSelect={handleAsmanSelect}
        data={asmanList}
        searchQuery=""
        onSearchChange={() => {}}
        title="Select Asman"
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollView: {
    flex: 1,
  },
  buttonContainer: {
    padding: 20,
    marginTop: 50,
  },
  buttonSpacer: {
    height: 12,
  },
  selectedItem: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  selectedTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  ordersContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  orderItem: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});

export default TestScreen2;
