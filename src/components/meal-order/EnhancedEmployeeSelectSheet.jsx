import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
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
  const bottomSheetRef = useRef(null);
  const inputRef = useRef(null);
  const inputTextRef = useRef("");
  const noteRef = useRef("");
  const customNameRef = useRef("");
  const [searchText, setSearchText] = useState("");

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

  const handleClose = useCallback(() => {
    setCurrentStep(0);
    setSelectedEmployee(null);
    setSelectedMenu(null);
    noteRef.current = "";
    customNameRef.current = "";
    onClose();
  }, [onClose]);

  const handleComplete = useCallback(() => {
    onComplete({
      employee: selectedEmployee,
      menu: selectedMenu,
      note: noteRef.current,
    });
    handleClose();
  }, [selectedEmployee, selectedMenu, onComplete, handleClose]);

  // Handle non-PLNIP employee name submit
  const handleCustomNameSubmit = useCallback(() => {
    if (customNameRef.current.trim()) {
      setSelectedEmployee({
        id: Date.now().toString(),
        name: customNameRef.current.trim(),
      });
      setCurrentStep(1);
    }
  }, []);

  // Auto-proceed when employee selected
  useEffect(() => {
    if (currentStep === 0 && selectedEmployee) {
      setCurrentStep(1);
    }
  }, [currentStep, selectedEmployee]);

  // Auto-proceed when menu selected
  useEffect(() => {
    if (currentStep === 1 && selectedMenu) {
      setCurrentStep(2);
    }
  }, [currentStep, selectedMenu]);

  const renderEmployeeSelection = () => (
    <View className="flex-1">
      <View className="border-b border-gray-100 bg-white px-4 pb-4">
        <Text className="mb-4 text-xl font-semibold text-gray-800">
          {isPlnip ? "Pilih Pegawai" : "Input Nama Pegawai"}
        </Text>

        {isPlnip ? (
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
          <View className="rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              placeholder="Input nama pegawai"
              className="py-2.5 text-base text-gray-900"
              ref={(ref) => {
                if (ref) {
                  ref.setNativeProps({ text: customNameRef.current });
                }
              }}
              onChangeText={(text) => (customNameRef.current = text)}
              onSubmitEditing={handleCustomNameSubmit}
              returnKeyType="done"
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
          className="mb-4 rounded-lg border border-gray-200 bg-white px-3 py-2.5"
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
        <TouchableOpacity
          onPress={handleComplete}
          className="rounded-lg bg-blue-600 py-3"
        >
          <Text className="text-center text-base font-medium text-white">
            Selesai
          </Text>
        </TouchableOpacity>
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

  return (
    <BottomSheet
      ref={bottomSheetRef}
      visible={visible}
      onClose={handleClose}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableContentPanningGesture={true}
      enableHandlePanningGesture={true}
    >
      {renderContent()}
    </BottomSheet>
  );
};

export default EnhancedEmployeeSelectSheet;
