import React, { useState, useRef, lazy, Suspense } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMealOrderStore } from "../../store/mealOrderStore";
import { useEmployeeStore } from "../../store/employeeStore";
const DetailStepSheets = lazy(() =>
  import("./DetailStepSheets").then((module) => ({
    default: module.DetailStepSheets,
  }))
);

export const DetailStep = () => {
  const { formData, updateFormData, updatePIC, updateSupervisor } =
    useMealOrderStore();
  const { fetchEmployees, employeesByDepartment } = useEmployeeStore();

  const [isDropPointSheetVisible, setIsDropPointSheetVisible] = useState(false);
  const [isEmployeeSheetVisible, setIsEmployeeSheetVisible] = useState(false);
  const [isSubBidangSheetVisible, setIsSubBidangSheetVisible] = useState(false);
  const [isJudulPekerjaanSheetVisible, setIsJudulPekerjaanSheetVisible] =
    useState(false);

  //new
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Animation states
  const [pressedStates, setPressedStates] = useState({
    pic: false,
    department: false,
    dropPoint: false,
    jobTitle: false,
  });

  // Animation values
  const scaleAnims = {
    pic: useRef(new Animated.Value(1)).current,
    department: useRef(new Animated.Value(1)).current,
    dropPoint: useRef(new Animated.Value(1)).current,
    jobTitle: useRef(new Animated.Value(1)).current,
  };

  const handlePressIn = (key) => {
    setPressedStates((prev) => ({ ...prev, [key]: true }));
    Animated.spring(scaleAnims[key], {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (key) => {
    setPressedStates((prev) => ({ ...prev, [key]: false }));
    Animated.spring(scaleAnims[key], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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
  const quickDropPoints = ["Lobby Lantai 1", "Kantin Utama", "Ruang Meeting A"];

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 py-6">
        {/* Category Selection */}
        <View className="mb-4 px-3">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {mealTimes.map((meal) => {
                const icons = {
                  breakfast: "coffee",
                  lunch: "food",
                  afternoon: "tea",
                  dinner: "food-variant",
                };
                return (
                  <TouchableOpacity
                    key={meal.id}
                    onPress={() => updateFormData({ category: meal.label })}
                    className={`mr-3 rounded-2xl border-2 px-6 py-4 shadow-lg ${
                      formData.category === meal.label
                        ? "border-indigo-500 bg-indigo-50/80"
                        : "border-slate-100 bg-white"
                    }`}
                  >
                    <View className="items-center">
                      <MaterialCommunityIcons
                        name={icons[meal.id]}
                        size={24}
                        color={
                          formData.category === meal.label
                            ? "#4F46E5"
                            : "#64748B"
                        }
                      />
                      <Text
                        className={`mt-2 text-sm font-semibold ${
                          formData.category === meal.label
                            ? "text-indigo-700"
                            : "text-slate-600"
                        }`}
                      >
                        {meal.label}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          {currentRecommendation && (
            <TouchableOpacity
              onPress={() =>
                updateFormData({ category: currentRecommendation })
              }
              className="mt-4 flex-row items-center rounded-xl bg-indigo-50/50 px-4 py-3"
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#4F46E5"
              />
              <Text className="ml-2 text-sm font-medium text-indigo-600">
                Saat ini - {currentRecommendation}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Form Section */}
        <View className="px-4">
          {/* Job Title Selection */}
          <View className="mb-4">
            <Animated.View
              style={{ transform: [{ scale: scaleAnims.jobTitle }] }}
            >
              <TouchableOpacity
                onPress={() => setIsJudulPekerjaanSheetVisible(true)}
                onPressIn={() => handlePressIn("jobTitle")}
                onPressOut={() => handlePressOut("jobTitle")}
                className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-md ${
                  pressedStates.jobTitle
                    ? "border-indigo-300 bg-indigo-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <View className="flex-row items-center">
                  <View className="rounded-xl bg-indigo-50 p-2">
                    <MaterialCommunityIcons
                      name={
                        formData.judulPekerjaan
                          ? "check-circle"
                          : "bookmark-outline"
                      }
                      size={24}
                      color={formData.judulPekerjaan ? "#4CAF50" : "#4F46E5"}
                    />
                  </View>
                  <Text
                    className={`ml-3 ${
                      formData.judulPekerjaan
                        ? "text-base font-medium text-gray-900"
                        : "text-base text-gray-400"
                    }`}
                  >
                    {formData.judulPekerjaan || "Masukkan Judul Pekerjaan"}
                  </Text>
                </View>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={24}
                  color="#4F46E5"
                />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* PIC Information */}
          <View className="mb-4">
            <View className="space-y-4">
              <Animated.View style={{ transform: [{ scale: scaleAnims.pic }] }}>
                <TouchableOpacity
                  onPress={() => setIsEmployeeSheetVisible(true)}
                  onPressIn={() => handlePressIn("pic")}
                  onPressOut={() => handlePressOut("pic")}
                  className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-md ${
                    pressedStates.pic
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    {formData.pic.nomorHp && formData.pic.name ? (
                      <View className="rounded-xl bg-green-50 p-2">
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color="#4CAF50"
                        />
                      </View>
                    ) : formData.pic.name ? (
                      <View className="rounded-xl bg-red-50 p-2">
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={24}
                          color="#FF0000"
                        />
                      </View>
                    ) : (
                      <View className="rounded-xl bg-indigo-50 p-2">
                        <MaterialCommunityIcons
                          name="account-circle"
                          size={24}
                          color="#4F46E5"
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
                    color="#4F46E5"
                  />
                </TouchableOpacity>
              </Animated.View>
              <View className="space-y-4">
                <Animated.View
                  style={{ transform: [{ scale: scaleAnims.department }] }}
                >
                  <TouchableOpacity
                    onPress={() => setIsSubBidangSheetVisible(true)}
                    onPressIn={() => handlePressIn("department")}
                    onPressOut={() => handlePressOut("department")}
                    className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-md ${
                      pressedStates.department
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <View className="flex-row items-center">
                      {formData.supervisor.subBidang ? (
                        <View className="rounded-xl bg-green-50 p-2">
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={24}
                            color="#4CAF50"
                          />
                        </View>
                      ) : (
                        <View className="rounded-xl bg-indigo-50 p-2">
                          <MaterialCommunityIcons
                            name="office-building"
                            size={24}
                            color="#4F46E5"
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
                            ? `${formData.supervisor.subBidang.substring(
                                0,
                                20
                              )}...`
                            : formData.supervisor.subBidang
                          : "Select Subbidang"}
                      </Text>
                    </View>
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={24}
                      color="#4F46E5"
                    />
                  </TouchableOpacity>
                </Animated.View>
                {formData.supervisor.subBidang && (
                  <View className="flex-row items-center rounded-xl bg-indigo-50/50 px-4 py-3">
                    <MaterialCommunityIcons
                      name="information"
                      size={18}
                      color="#4F46E5"
                    />
                    <Text className="ml-2 text-sm font-medium text-indigo-600">
                      ASMAN: {formData.supervisor.name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Drop Point */}
          <View className="mb-8">
            <View className="space-y-4">
              <Animated.View
                style={{ transform: [{ scale: scaleAnims.dropPoint }] }}
              >
                <TouchableOpacity
                  onPress={() => setIsDropPointSheetVisible(true)}
                  onPressIn={() => handlePressIn("dropPoint")}
                  onPressOut={() => handlePressOut("dropPoint")}
                  className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 shadow-md ${
                    pressedStates.dropPoint
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    {formData.dropPoint ? (
                      <View className="rounded-xl bg-green-50 p-2">
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color="#4CAF50"
                        />
                      </View>
                    ) : (
                      <View className="rounded-xl bg-indigo-50 p-2">
                        <MaterialCommunityIcons
                          name="map-marker"
                          size={24}
                          color="#4F46E5"
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
                    color="#4F46E5"
                  />
                </TouchableOpacity>
              </Animated.View>

              {/* Quick Drop Point Selection */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row px-1 py-1">
                  {quickDropPoints.map((point) => (
                    <TouchableOpacity
                      key={point}
                      onPress={() => updateFormData({ dropPoint: point })}
                      className={`mr-3 rounded-full border px-3 py-2  transition-all ${
                        formData.dropPoint === point
                          ? "border-indigo-500 bg-indigo-50/80 scale-105"
                          : "border-slate-200 bg-white hover:border-indigo-100 hover:bg-indigo-50/10"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <MaterialCommunityIcons
                          name="map-marker-check"
                          size={18}
                          color={
                            formData.dropPoint === point ? "#4F46E5" : "#64748B"
                          }
                        />
                        <Text
                          className={`ml-2 text-sm font-medium ${
                            formData.dropPoint === point
                              ? "text-indigo-700"
                              : "text-slate-600"
                          }`}
                        >
                          {point}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Bottom Sheets */}
        <Suspense fallback={null}>
          <DetailStepSheets
            isSubBidangSheetVisible={isSubBidangSheetVisible}
            isEmployeeSheetVisible={isEmployeeSheetVisible}
            isDropPointSheetVisible={isDropPointSheetVisible}
            isJudulPekerjaanSheetVisible={isJudulPekerjaanSheetVisible}
            onSubBidangClose={() => setIsSubBidangSheetVisible(false)}
            onEmployeeClose={() => setIsEmployeeSheetVisible(false)}
            onDropPointClose={() => setIsDropPointSheetVisible(false)}
            onJudulPekerjaanClose={() => setIsJudulPekerjaanSheetVisible(false)}
            onSubBidangSelect={(department) => {
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
            onEmployeeSelect={(user) => {
              updatePIC({
                name: user.name,
                nomorHp: user.nomorHp || "",
              });

              if (user.department && !formData.supervisor.subBidang) {
                const supervisor = employeesByDepartment[user.department]?.find(
                  (emp) => emp.isAsman
                );
                if (supervisor) {
                  updateSupervisor({
                    subBidang: user.department,
                    name: supervisor.name,
                    nomorHp: supervisor.nomorHp || "",
                  });
                }
              }
            }}
            onDropPointSelect={(point) => updateFormData({ dropPoint: point })}
            onJudulPekerjaanSave={(title) =>
              updateFormData({ judulPekerjaan: title })
            }
          />
        </Suspense>
      </View>
    </ScrollView>
  );
};

export default DetailStep;
