import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
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

  const mealTimes = [
    { id: "breakfast", label: "Sarapan", startHour: 6, endHour: 9 },
    { id: "lunch", label: "Makan Siang", startHour: 11, endHour: 14 },
    { id: "afternoon", label: "Makan Sore", startHour: 15, endHour: 17 },
    { id: "dinner", label: "Makan Malam", startHour: 18, endHour: 21 },
  ];

  // Get current recommendation based on time
  const getCurrentMealRecommendation = () => {
    const currentHour = new Date().getHours();
    const recommendation = mealTimes.find(
      (meal) => currentHour >= meal.startHour && currentHour <= meal.endHour
    );
    return recommendation?.label;
  };

  const currentRecommendation = getCurrentMealRecommendation();

  // Common drop points for quick access
  const quickDropPoints = ["Lobby Lantai 1", "Kantin Utama", "Ruang Meeting A"];

  return (
    <ScrollView className="flex-1 rounded-t-3xl bg-gray-50">
      <View className="py-0">
        {/* Category Selection */}
        <View className="p-4">
          <Text className="mb-3 text-base font-semibold text-gray-800">
            Tipe Pesanan
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {mealTimes.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  onPress={() => updateFormData({ category: meal.label })}
                  className={`mr-3 rounded-full border px-6 py-2.5 ${
                    formData.category === meal.label
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      formData.category === meal.label
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {meal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {currentRecommendation && (
            <TouchableOpacity
              onPress={() =>
                updateFormData({ category: currentRecommendation })
              }
              className="mt-4 flex-row items-center"
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#3B82F6"
              />
              <Text className="font-base ml-1 text-sm text-blue-500">
                Pilih jadwal makan sekarang - {currentRecommendation}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Main Form Section */}
        <View className="p-2 px-4">
          {/* Job Title Selection */}
          <JobTitleSelection
            jobTitle={formData.judulPekerjaan}
            onPress={() => setJobTitleSheetVisible(true)}
          />

          {/* PIC Information */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-800">
                PIC Information
              </Text>
              <View className="flex-row items-center">
                <Text className="mr-2 text-sm text-gray-600">Custom</Text>
                <Switch
                  value={isCustomPic}
                  onValueChange={(value) => {
                    setIsCustomPic(value);
                    if (!value) {
                      updatePIC({ name: "", nomorHp: "" });
                    }
                  }}
                />
              </View>
            </View>
            <View className="space-y-3">
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={() =>
                    isCustomPic
                      ? setCustomPicSheetVisible(true)
                      : setPicSheetVisible(true)
                  }
                  className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
                >
                  <Text
                    className={
                      formData.pic.name ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {formData.pic.name || "Select PIC Name"}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              <View className="space-y-3">
                <TouchableOpacity
                  onPress={() => setDepartmentSheetVisible(true)}
                  className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
                >
                  <Text
                    className={
                      formData.supervisor.subBidang
                        ? "text-gray-900"
                        : "text-gray-400"
                    }
                  >
                    {formData.supervisor.subBidang || "Select Subbidang"}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
                {formData.supervisor.subBidang && (
                  <View className="flex-row items-center space-x-1.5 pl-1">
                    <MaterialCommunityIcons
                      name="information"
                      size={14}
                      color="#3B82F6"
                    />
                    <Text className="font-base text-xs italic text-blue-500">
                      Supervisor: {formData.supervisor.name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Drop Point */}
          <View>
            <Text className="mb-2 text-sm font-medium text-gray-800">
              Drop Point
            </Text>
            <View className="space-y-3">
              <TouchableOpacity
                onPress={() => setDropPointVisible(true)}
                className="flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
              >
                <Text
                  className={
                    formData.dropPoint ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {formData.dropPoint || "Select drop point location"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {/* Quick Drop Point Selection */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row py-1">
                  {quickDropPoints.map((point) => (
                    <TouchableOpacity
                      key={point}
                      onPress={() => updateFormData({ dropPoint: point })}
                      className={`mr-2 rounded-full border px-4 py-1.5 ${
                        formData.dropPoint === point
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          formData.dropPoint === point
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {point}
                      </Text>
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
            // Update PIC info
            updatePIC({
              name: user.name,
              nomorHp: user.nomorHp || "",
            });

            // Find and set supervisor from the same department
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
            // Find supervisor (Asman) for the selected department
            const departmentUsers = mockUsers[department];
            const supervisor = departmentUsers.find((u) => u.isAsman);

            // Update both subBidang and supervisor information
            updateSupervisor({
              subBidang: department,
              name: supervisor ? supervisor.name : "",
              nomorHp: supervisor ? supervisor.nomorHp || "" : "",
            });
          }}
          selected={formData.supervisor.subBidang}
        />

        {/* Job Title Bottom Sheet */}
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
