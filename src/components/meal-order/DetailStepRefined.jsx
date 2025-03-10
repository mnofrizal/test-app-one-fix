import React, {
  useCallback,
  useRef,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import EmployeeSelector from "../../components/EmployeeSelector";
import DropPointSelector from "../../components/DropPointSelector";
import SubBidangSelector from "../../components/SubBidangSelector";
import { useEmployeeStore } from "../../store/employeeStore";
import { useMealOrderStore } from "../../store/mealOrderStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export const DetailStepRefined = () => {
  // Get store data
  const employeesByDepartment = useEmployeeStore(
    (state) => state.employeesByDepartment
  );

  const { formData, updateFormData, updatePIC, updateSupervisor } =
    useMealOrderStore();

  const employeeSheetRef = useRef(null);
  const dropPointSheetRef = useRef(null);
  const subBidangSheetRef = useRef(null);

  const [isEmployeeSheetVisible, setIsEmployeeSheetVisible] = useState(false);
  const [isDropPointSheetVisible, setIsDropPointSheetVisible] = useState(false);
  const [isSubBidangSheetVisible, setIsSubBidangSheetVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 380);

    return () => clearTimeout(timer);
  }, []);

  const categories = [
    { id: "sarapan", label: "Sarapan" },
    { id: "makan_siang", label: "Makan Siang" },
    { id: "makan_sore", label: "Makan Sore" },
    { id: "makan_malam", label: "Makan Malam" },
  ];

  // When employee is selected, also set their sub bidang
  const handleEmployeeDismiss = useCallback(
    () => setIsEmployeeSheetVisible(false),
    []
  );

  // Handlers for Drop Point Selector
  const handleDropPointDismiss = useCallback(
    () => setIsDropPointSheetVisible(false),
    []
  );

  // Handlers for Sub Bidang Selector
  const handleSubBidangDismiss = useCallback(
    () => setIsSubBidangSheetVisible(false),
    []
  );

  const mealTimes = [
    { id: "breakfast", label: "Sarapan", startHour: 6, endHour: 9 },
    { id: "lunch", label: "Makan Siang", startHour: 11, endHour: 14 },
    { id: "afternoon", label: "Makan Sore", startHour: 15, endHour: 17 },
    { id: "dinner", label: "Makan Malam", startHour: 18, endHour: 24 },
  ];

  const getCurrentMealRecommendation = () => {
    const currentHour = new Date().getHours();
    const recommendation = mealTimes.find(
      (meal) => currentHour >= meal.startHour && currentHour <= meal.endHour
    );
    return recommendation?.label;
  };
  const currentRecommendation = getCurrentMealRecommendation();

  if (!isRendered) {
    return (
      <GestureHandlerRootView className="flex-1 bg-[#f8f9ff]">
        <View className="flex-1 p-4">
          {/* Skeleton for Category Pills */}
          <View className="mb-4 flex-row flex-wrap gap-2">
            {[1, 2, 3, 4].map((index) => (
              <View
                key={index}
                className="h-10 w-24 animate-pulse rounded-full bg-gray-200"
              />
            ))}
          </View>

          {/* Skeleton for Selection Buttons */}
          <View className="mb-6 space-y-4">
            {/* Judul Pekerjaan Skeleton */}
            <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-md">
              <View className="flex-row items-center">
                <View className="h-8 w-8 animate-pulse rounded-xl bg-gray-200" />
                <View className="ml-3 h-5 w-40 animate-pulse rounded-md bg-gray-200" />
              </View>
            </View>

            {/* PIC Skeleton */}
            <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-md">
              <View className="flex-row items-center">
                <View className="h-8 w-8 animate-pulse rounded-xl bg-gray-200" />
                <View className="ml-3 h-5 w-32 animate-pulse rounded-md bg-gray-200" />
              </View>
            </View>

            {/* Subbidang Skeleton */}
            <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-md">
              <View className="flex-row items-center">
                <View className="h-8 w-8 animate-pulse rounded-xl bg-gray-200" />
                <View className="ml-3 h-5 w-36 animate-pulse rounded-md bg-gray-200" />
              </View>
            </View>

            {/* Drop Point Skeleton */}
            <View className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-md">
              <View className="flex-row items-center">
                <View className="h-8 w-8 animate-pulse rounded-xl bg-gray-200" />
                <View className="ml-3 h-5 w-44 animate-pulse rounded-md bg-gray-200" />
              </View>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1 bg-[#f8f9ff]">
      <View className="flex-1 p-4">
        {/* Category Pills */}
        {/* <View>
          <Text className="mb-4 px-2 text-lg font-semibold text-gray-800">
            Tipe Pesanan
          </Text>
        </View> */}
        <View className="mb-6 flex-row flex-wrap gap-2 pt-2">
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => updateFormData({ category: category.label })}
              className={`rounded-full px-4 py-2 ${
                formData.category === category.label
                  ? "bg-blue-500 border border-blue-500"
                  : "bg-[#eeeeee] border border-[#eeeeee]"
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  formData.category === category.label
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </View>
        {currentRecommendation && (
          <TouchableOpacity
            onPress={() => updateFormData({ category: currentRecommendation })}
            className="mb-4 flex-row items-center rounded-xl bg-orange-200/20 px-4 py-3"
          >
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#f96d03"
            />
            <Text className="ml-2 text-sm font-medium text-orange-600">
              Saat ini - {currentRecommendation}
            </Text>
          </TouchableOpacity>
        )}

        {/* Selection Buttons */}
        <View className="space-y-4">
          <View
            className={`flex-row items-center rounded-2xl border px-4 py-2.5 shadow-md ${
              formData.judulPekerjaan
                ? "bg-green-50 border-[#63c67c]"
                : "border-gray-200 bg-white"
            }`}
          >
            <View className="rounded-xl p-2">
              <MaterialCommunityIcons
                name={
                  formData.judulPekerjaan ? "check-circle" : "bookmark-outline"
                }
                size={24}
                color={formData.judulPekerjaan ? "#63c67c" : "#076fcd"}
              />
            </View>
            <TextInput
              className="ml-3 flex-1 text-base"
              placeholder="Masukkan Judul Pekerjaan"
              value={formData.judulPekerjaan}
              onChangeText={(text) => updateFormData({ judulPekerjaan: text })}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity
            onPress={() => setIsEmployeeSheetVisible(true)}
            className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-md ${
              !formData.pic.name
                ? "border-gray-200 bg-white"
                : formData.pic.nomorHp && formData.pic.name
                ? "bg-green-50 border-[#63c67c]"
                : "bg-red-50 border-red-600"
            }`}
          >
            <View className="flex-row items-center">
              {formData.pic.nomorHp && formData.pic.name ? (
                <View className="rounded-xl bg-green-50 p-2">
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#63c67c"
                  />
                </View>
              ) : formData.pic.name ? (
                <View className="rounded-xl p-2">
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={24}
                    color="#FF0000"
                  />
                </View>
              ) : (
                <View className="rounded-xl p-2">
                  <MaterialCommunityIcons
                    name="account-circle"
                    size={24}
                    color="#076fcd"
                  />
                </View>
              )}

              <Text
                className={`ml-3 ${
                  formData.pic.name
                    ? "text-base font-medium text-gray-900"
                    : "text-base text-gray-400"
                }`}
              >
                {formData.pic.name || "Select PIC Name"}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#096ecf"
            />
          </TouchableOpacity>

          <View className="space-y-4">
            <TouchableOpacity
              onPress={() => setIsSubBidangSheetVisible(true)}
              className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-md ${
                formData.supervisor.subBidang
                  ? "border-[#63c67c] bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex-row items-center">
                {formData.supervisor.subBidang ? (
                  <View className="rounded-xl bg-green-50 p-2">
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#63c67c"
                    />
                  </View>
                ) : (
                  <View className="rounded-xl p-2">
                    <MaterialCommunityIcons
                      name="office-building"
                      size={24}
                      color="#076fcd"
                    />
                  </View>
                )}
                <Text
                  className={`ml-3 ${
                    formData.supervisor.subBidang
                      ? "text-base font-medium text-gray-900"
                      : "text-base text-gray-400"
                  }`}
                >
                  {formData.supervisor.subBidang
                    ? formData.supervisor.subBidang.length > 20
                      ? `${formData.supervisor.subBidang.substring(0, 20)}...`
                      : formData.supervisor.subBidang
                    : "Select Subbidang"}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#096ecf"
              />
            </TouchableOpacity>

            {formData.supervisor.subBidang && (
              <View className="mb-4 flex-row items-center rounded-xl bg-orange-200/20 px-4 py-3">
                <MaterialCommunityIcons
                  name="information-outline"
                  size={14}
                  color="#f96d03"
                />
                <Text className="ml-2 text-sm font-medium text-orange-600">
                  ASMAN: {formData.supervisor.name}
                </Text>
              </View>
            )}
          </View>

          <View className="mb-8">
            <View className="space-y-4">
              <TouchableOpacity
                onPress={() => setIsDropPointSheetVisible(true)}
                className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-md ${
                  formData.dropPoint
                    ? "border-[#63c67c] bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row items-center">
                  {formData.dropPoint ? (
                    <View className="rounded-xl bg-green-50 p-2">
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={24}
                        color="#63c67c"
                      />
                    </View>
                  ) : (
                    <View className="rounded-xl p-2">
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={24}
                        color="#076fcd"
                      />
                    </View>
                  )}
                  <Text
                    className={`ml-3 ${
                      formData.dropPoint
                        ? "text-base font-medium text-gray-900"
                        : "text-base text-gray-400"
                    }`}
                  >
                    {formData.dropPoint || "Select drop point location"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#096ecf"
                />
              </TouchableOpacity>

              {/* Quick Drop Point Selection */}
            </View>
          </View>
        </View>

        {/* Selector Sheets */}
        <SubBidangSelector
          ref={subBidangSheetRef}
          onSelect={(department) => {
            const supervisor = employeesByDepartment[department]?.find(
              (emp) => emp.isAsman
            );
            if (supervisor) {
              updateSupervisor({
                subBidang: department,
                name: supervisor.name,
                nomorHp: supervisor.nomorHp || "",
              });
            }
          }}
          isVisible={isSubBidangSheetVisible}
          onClose={handleSubBidangDismiss}
        />

        <EmployeeSelector
          ref={employeeSheetRef}
          onSelect={(user) => {
            // Update PIC info
            updatePIC({
              name: user.name,
              nomorHp: user.nomorHp || "",
            });

            // Find which department the employee belongs to and set supervisor
            if (!formData.supervisor.subBidang) {
              for (const [department, employees] of Object.entries(
                employeesByDepartment
              )) {
                if (employees.some((emp) => emp.id === user.id)) {
                  const supervisor = employees.find((emp) => emp.isAsman);
                  if (supervisor) {
                    updateSupervisor({
                      subBidang: department,
                      name: supervisor.name,
                      nomorHp: supervisor.nomorHp || "",
                    });
                  }
                  break;
                }
              }
            }
          }}
          isVisible={isEmployeeSheetVisible}
          onClose={handleEmployeeDismiss}
        />

        <DropPointSelector
          ref={dropPointSheetRef}
          onSelect={(point) => updateFormData({ dropPoint: point })}
          isVisible={isDropPointSheetVisible}
          onClose={handleDropPointDismiss}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default DetailStepRefined;
