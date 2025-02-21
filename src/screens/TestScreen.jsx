import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import { View, Text, Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EmployeeSelector from "../components/EmployeeSelector";
import DropPointSelector from "../components/DropPointSelector";
import SubBidangSelector from "../components/SubBidangSelector";
import { useEmployeeStore } from "../store/employeeStore";

const TestScreen = () => {
  // Get store data
  const employeesByDepartment = useEmployeeStore(
    (state) => state.employeesByDepartment
  );

  const employeeSheetRef = useRef(null);
  const dropPointSheetRef = useRef(null);
  const subBidangSheetRef = useRef(null);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDropPoint, setSelectedDropPoint] = useState(null);
  const [selectedSubBidang, setSelectedSubBidang] = useState(null);

  const [isEmployeeSheetVisible, setIsEmployeeSheetVisible] = useState(false);
  const [isDropPointSheetVisible, setIsDropPointSheetVisible] = useState(false);
  const [isSubBidangSheetVisible, setIsSubBidangSheetVisible] = useState(false);

  // Handlers for Employee Selector
  // Get supervisor for selected sub bidang
  const selectedSubBidangSupervisor = useMemo(() => {
    if (!selectedSubBidang || !employeesByDepartment[selectedSubBidang])
      return null;
    return employeesByDepartment[selectedSubBidang].find((emp) => emp.isAsman);
  }, [selectedSubBidang, employeesByDepartment]);

  const handleEmployeePress = useCallback(
    () => setIsEmployeeSheetVisible(true),
    []
  );

  // When employee is selected, also set their sub bidang
  const handleEmployeeSelect = useCallback(
    (employee) => {
      setSelectedEmployee(employee);
      // Find which sub bidang the employee belongs to
      const subBidang = Object.entries(employeesByDepartment).find(
        ([_, employees]) => employees.some((emp) => emp.id === employee.id)
      );
      if (subBidang) {
        setSelectedSubBidang(subBidang[0]);
      }
    },
    [employeesByDepartment]
  );
  const handleEmployeeDismiss = useCallback(
    () => setIsEmployeeSheetVisible(false),
    []
  );

  // Handlers for Drop Point Selector
  const handleDropPointPress = useCallback(
    () => setIsDropPointSheetVisible(true),
    []
  );
  const handleDropPointDismiss = useCallback(
    () => setIsDropPointSheetVisible(false),
    []
  );

  // Handlers for Sub Bidang Selector
  const handleSubBidangPress = useCallback(
    () => setIsSubBidangSheetVisible(true),
    []
  );
  const handleSubBidangDismiss = useCallback(
    () => setIsSubBidangSheetVisible(false),
    []
  );

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 p-4">
        {/* Selection Buttons */}
        <View className="mb-6 space-y-4">
          <Pressable
            className="rounded-lg bg-blue-500 p-4"
            onPress={handleSubBidangPress}
          >
            <Text className="text-center text-white">
              {selectedSubBidang || "Select Sub Bidang"}
            </Text>
          </Pressable>

          <Pressable
            className="rounded-lg bg-blue-500 p-4"
            onPress={handleEmployeePress}
          >
            <Text className="text-center text-white">
              {selectedEmployee ? selectedEmployee.name : "Select Employee"}
            </Text>
          </Pressable>

          <Pressable
            className="rounded-lg bg-blue-500 p-4"
            onPress={handleDropPointPress}
          >
            <Text className="text-center text-white">
              {selectedDropPoint || "Select Drop Point"}
            </Text>
          </Pressable>
        </View>

        {/* Summary Card */}
        {(selectedSubBidang || selectedEmployee || selectedDropPoint) && (
          <View className="rounded-lg border border-gray-200 bg-white p-4">
            <Text className="text-lg font-semibold text-gray-900">Summary</Text>

            {/* Sub Bidang with Supervisor Info */}
            {selectedSubBidang && (
              <View className="mt-3">
                <Text className="text-sm font-medium text-gray-500">
                  Sub Bidang
                </Text>
                <View className="mt-1 flex-row items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                    <Text className="text-sm font-semibold text-indigo-600">
                      {selectedSubBidang
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <View className="ml-3">
                    <Text className="text-base font-medium text-gray-900">
                      {selectedSubBidang}
                    </Text>
                    {selectedSubBidangSupervisor && (
                      <Text className="text-sm text-gray-500">
                        Supervisor: {selectedSubBidangSupervisor.name}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}

            {selectedEmployee && (
              <View className="mt-3">
                <Text className="text-sm font-medium text-gray-500">
                  Employee
                </Text>
                <View className="mt-1 flex-row items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Text className="text-sm font-semibold text-blue-600">
                      {selectedEmployee.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <View className="ml-3">
                    <Text className="text-base font-medium text-gray-900">
                      {selectedEmployee.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {selectedEmployee.isAsman ? "Supervisor" : "Staff"}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {selectedDropPoint && (
              <View className="mt-3">
                <Text className="text-sm font-medium text-gray-500">
                  Drop Point
                </Text>
                <View className="mt-1 flex-row items-center">
                  <View className="h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <Text className="text-sm font-semibold text-green-600">
                      {selectedDropPoint
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <Text className="ml-3 text-base font-medium text-gray-900">
                    {selectedDropPoint}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Selector Sheets */}
        <SubBidangSelector
          ref={subBidangSheetRef}
          onSelect={setSelectedSubBidang}
          isVisible={isSubBidangSheetVisible}
          onClose={handleSubBidangDismiss}
        />

        <EmployeeSelector
          ref={employeeSheetRef}
          onSelect={handleEmployeeSelect}
          isVisible={isEmployeeSheetVisible}
          onClose={handleEmployeeDismiss}
        />

        <DropPointSelector
          ref={dropPointSheetRef}
          onSelect={setSelectedDropPoint}
          isVisible={isDropPointSheetVisible}
          onClose={handleDropPointDismiss}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default TestScreen;
