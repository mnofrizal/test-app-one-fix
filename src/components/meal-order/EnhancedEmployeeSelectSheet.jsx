import React, { useState, useMemo, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import BottomSheet from "../BottomSheet";
import { mockUsers } from "../../constants/mockUsers";
import { mockMenus } from "../../constants/mockMenus";

const EnhancedEmployeeSelectSheet = ({
  visible,
  onClose,
  onComplete,
  selected,
  department,
  isPlnip,
  entity,
  isSameBulkMenu,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [buttonUpdateTrigger, setButtonUpdateTrigger] = useState(0);
  const bottomSheetRef = useRef(null);
  const inputRef = useRef(null);
  const inputTextRef = useRef("");
  const noteRef = useRef("");
  const customNameRef = useRef("");
  const [searchText, setSearchText] = useState("");

  // Get department employees or show empty input for non-PLNIP
  const employees = useMemo(() => {
    if (!isPlnip || !department) return [];
    return mockUsers[department]?.filter((user) => !user.isAsman) || [];
  }, [department, isPlnip]);

  const filteredEmployees = useMemo(() => {
    if (!inputTextRef.current) return employees;
    const searchLower = inputTextRef.current.toLowerCase();
    return employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchLower)
    );
  }, [searchText, employees]);

  const snapPoints = useMemo(() => ["65%", "85%"], []);

  // Set default employee when sameBulkMenu is true
  useEffect(() => {
    if (visible && isSameBulkMenu && !isPlnip) {
      setSelectedEmployee({
        id: `${entity}_0`,
        name: `Pegawai ${entity}`,
      });
      setCurrentStep(1);
    }
  }, [visible, isSameBulkMenu, isPlnip, entity]);

  const handleNext = () => {
    if (currentStep === 0) {
      if (isPlnip && selectedEmployee) {
        setCurrentStep(1);
      } else if (!isPlnip && customNameRef.current.trim()) {
        setSelectedEmployee({
          id: Date.now().toString(),
          name: customNameRef.current.trim(),
        });
        setCurrentStep(1);
      }
    } else if (currentStep === 1 && selectedMenu) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      onComplete({
        employee: selectedEmployee,
        menu: selectedMenu,
        note: noteRef.current,
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setCurrentStep(0);
    setSelectedEmployee(null);
    setSelectedMenu(null);
    noteRef.current = "";
    customNameRef.current = "";
    onClose();
  };

  const renderEmployeeSelection = () => (
    <View className="flex-1">
      <View className="border-b border-gray-100 bg-white px-4 pb-4">
        <Text className="mb-4 text-xl font-semibold text-gray-800">
          {isPlnip ? "Pilih Pegawai" : "Input Nama Pegawai"}
        </Text>

        {isPlnip ? (
          // Search input for PLNIP employees
          <View className="rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              ref={inputRef}
              placeholder="Cari pegawai"
              className="py-2.5 text-base text-gray-900"
              onChangeText={(text) => {
                inputTextRef.current = text;
                setSearchText(text);
              }}
              defaultValue={inputTextRef.current}
            />
          </View>
        ) : !isSameBulkMenu ? (
          // Custom name input for non-PLNIP when not in same bulk menu mode
          <View className="rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              placeholder="Input nama pegawai"
              className="py-2.5 text-base text-gray-900"
              ref={(ref) => {
                if (ref) {
                  ref.setNativeProps({ text: customNameRef.current });
                }
              }}
              onChangeText={(text) => {
                customNameRef.current = text;
                // Force button update
                setButtonUpdateTrigger((prev) => prev + 1);
              }}
            />
          </View>
        ) : null}
      </View>

      {isPlnip && (
        <ScrollView className="flex-1" bounces={false}>
          <View className="space-y-2 p-4">
            {filteredEmployees.map((employee) => (
              <TouchableOpacity
                key={employee.id}
                onPress={() => setSelectedEmployee(employee)}
                className={`rounded-lg border p-4 ${
                  selectedEmployee?.id === employee.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    className={`text-base ${
                      selectedEmployee?.id === employee.id
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {employee.name}
                  </Text>
                  {selectedEmployee?.id === employee.id && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#2563EB"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );

  const renderMenuSelection = () => (
    <View className="flex-1">
      <View className="border-b border-gray-100 bg-white px-4 pb-4">
        <Text className="mb-4 text-xl font-semibold text-gray-800">
          Pilih Menu untuk {selectedEmployee?.name}
        </Text>
      </View>

      <ScrollView className="flex-1" bounces={false}>
        <View className="space-y-2 p-4">
          {mockMenus.map((menu) => (
            <TouchableOpacity
              key={menu.id}
              onPress={() => setSelectedMenu(menu)}
              className={`rounded-lg border p-4 ${
                selectedMenu?.id === menu.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className={`text-base ${
                    selectedMenu?.id === menu.id
                      ? "text-blue-600"
                      : "text-gray-800"
                  }`}
                >
                  {menu.name}
                </Text>
                {selectedMenu?.id === menu.id && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#2563EB"
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderNoteInput = () => (
    <View className="flex-1">
      <View className="border-b border-gray-100 bg-white px-4 pb-4">
        <Text className="mb-4 text-xl font-semibold text-gray-800">
          Tambah Catatan
        </Text>
      </View>

      <View className="p-4">
        <BottomSheetTextInput
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5"
          placeholder="Tambah catatan pesanan (opsional)"
          multiline={true}
          numberOfLines={4}
          ref={(ref) => {
            if (ref) {
              ref.setNativeProps({ text: noteRef.current });
            }
          }}
          onChangeText={(text) => {
            noteRef.current = text;
          }}
        />
      </View>
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return renderEmployeeSelection();
      case 1:
        return renderMenuSelection();
      case 2:
        return renderNoteInput();
      default:
        return null;
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return isPlnip
        ? !!selectedEmployee
        : isSameBulkMenu || !!customNameRef.current?.trim();
    }
    if (currentStep === 1) {
      return !!selectedMenu;
    }
    return true;
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      visible={visible}
      onClose={handleClose}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
      footerComponent={() => (
        <View
          className="border-t border-gray-100 bg-white p-4"
          style={{
            paddingBottom: Platform.OS === "ios" ? 34 : 16,
          }}
        >
          <TouchableOpacity
            onPress={handleNext}
            disabled={!canProceed()}
            className={`rounded-lg py-3 ${
              canProceed() ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <Text className="text-center text-base font-medium text-white">
              {currentStep === 2 ? "Selesai" : "Lanjut"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    >
      {renderContent()}
    </BottomSheet>
  );
};

export default EnhancedEmployeeSelectSheet;
