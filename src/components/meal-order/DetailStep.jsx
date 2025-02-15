import React, { useState, useRef } from "react";
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
import { mockUsers } from "../../constants/mockUsers";
import DropPointSheet from "./DropPointSheet";
import UserSelectSheet from "./UserSelectSheet";
import DepartmentSheet from "./DepartmentSheet";
import CustomPICSheet from "./CustomPICSheet";
import JobTitleSheet from "./JobTitleSheet";
import JobTitleSelection from "./JobTitleSelection";

export const DetailStep = () => {
  const { formData, updateFormData, updatePIC, updateSupervisor } =
    useMealOrderStore();
  const [dropPointVisible, setDropPointVisible] = useState(false);
  const [picSheetVisible, setPicSheetVisible] = useState(false);
  const [departmentSheetVisible, setDepartmentSheetVisible] = useState(false);
  const [customPicSheetVisible, setCustomPicSheetVisible] = useState(false);
  const [jobTitleSheetVisible, setJobTitleSheetVisible] = useState(false);
  const [isCustomPic, setIsCustomPic] = useState(false);

  // Animation states
  const [pressedStates, setPressedStates] = useState({
    pic: false,
    department: false,
    dropPoint: false,
  });

  // Animation values
  const scaleAnims = {
    pic: useRef(new Animated.Value(1)).current,
    department: useRef(new Animated.Value(1)).current,
    dropPoint: useRef(new Animated.Value(1)).current,
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
    <ScrollView className="flex-1 bg-gray-50">
      <View className="py-6">
        {/* Category Selection */}
        <View className="mb-4 px-6">
          <Text className="mb-6 text-2xl font-bold tracking-tight text-gray-900">
            Tipe Pesanan
          </Text>
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
        <View className="px-6">
          {/* Job Title Selection */}
          <JobTitleSelection
            jobTitle={formData.judulPekerjaan}
            onPress={() => setJobTitleSheetVisible(true)}
          />

          {/* PIC Information */}
          <View className="mb-4">
            <View className="space-y-4">
              <Animated.View style={{ transform: [{ scale: scaleAnims.pic }] }}>
                <TouchableOpacity
                  onPress={() =>
                    isCustomPic
                      ? setCustomPicSheetVisible(true)
                      : setPicSheetVisible(true)
                  }
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
                    onPress={() => setDepartmentSheetVisible(true)}
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
                  onPress={() => setDropPointVisible(true)}
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
        <CustomPICSheet
          visible={customPicSheetVisible}
          onClose={() => setCustomPicSheetVisible(false)}
          onSave={updatePIC}
          initialData={formData.pic}
        />

        <DropPointSheet
          visible={dropPointVisible}
          onClose={() => setDropPointVisible(false)}
          onSelect={(point) => updateFormData({ dropPoint: point })}
          selected={formData.dropPoint}
        />

        <UserSelectSheet
          visible={picSheetVisible}
          onClose={() => setPicSheetVisible(false)}
          onSelect={(user) => {
            updatePIC({
              name: user.name,
              nomorHp: user.nomorHp || "",
            });

            const departmentUsers = mockUsers[user.department];
            const supervisor = departmentUsers.find((u) => u.isAsman);
            if (supervisor) {
              updateSupervisor({
                name: supervisor.name,
                nomorHp: supervisor.nomorHp || "",
                subBidang: user.department,
              });
            }
          }}
          selected={formData.pic.name ? { name: formData.pic.name } : null}
          title="Select PIC"
        />

        <DepartmentSheet
          visible={departmentSheetVisible}
          onClose={() => setDepartmentSheetVisible(false)}
          onSelect={(department) => {
            const departmentUsers = mockUsers[department];
            const supervisor = departmentUsers.find((u) => u.isAsman);

            updateSupervisor({
              subBidang: department,
              name: supervisor ? supervisor.name : "",
              nomorHp: supervisor ? supervisor.nomorHp || "" : "",
            });
          }}
          selected={formData.supervisor.subBidang}
        />

        <JobTitleSheet
          visible={jobTitleSheetVisible}
          onClose={() => setJobTitleSheetVisible(false)}
          onSave={(title) => updateFormData({ judulPekerjaan: title })}
          initialValue={formData.judulPekerjaan}
        />
      </View>
    </ScrollView>
  );
};

export default DetailStep;
