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
    <ScrollView className="flex-1 bg-slate-50">
      <View className="py-2">
        {/* Category Selection */}
        <View className="p-6">
          <Text className="mb-4 text-xl font-bold tracking-tight text-gray-900">
            Tipe Pesanan
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {mealTimes.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  onPress={() => updateFormData({ category: meal.label })}
                  className={`mr-3 rounded-full border px-6 py-3 shadow-sm ${
                    formData.category === meal.label
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      formData.category === meal.label
                        ? "text-indigo-700"
                        : "text-slate-600"
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
                color="#4F46E5"
              />
              <Text className="ml-2 text-sm font-medium text-indigo-600">
                Pilih jadwal makan sekarang - {currentRecommendation}
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
          <View className="mb-8">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">
                PIC Information
              </Text>
              <View className="flex-row items-center space-x-3">
                <Text className="text-sm font-medium text-slate-600">
                  Custom
                </Text>
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
            <View className="space-y-4">
              <TouchableOpacity
                onPress={() =>
                  isCustomPic
                    ? setCustomPicSheetVisible(true)
                    : setPicSheetVisible(true)
                }
                className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <Text
                  className={
                    formData.pic.name
                      ? "text-base font-medium text-gray-900"
                      : "text-base text-gray-400"
                  }
                >
                  {formData.pic.name || "Select PIC Name"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>

              <View className="space-y-4">
                <TouchableOpacity
                  onPress={() => setDepartmentSheetVisible(true)}
                  className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
                >
                  <Text
                    className={
                      formData.supervisor.subBidang
                        ? "text-base font-medium text-gray-900"
                        : "text-base text-gray-400"
                    }
                  >
                    {formData.supervisor.subBidang || "Select Subbidang"}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={22}
                    color="#64748B"
                  />
                </TouchableOpacity>
                {formData.supervisor.subBidang && (
                  <View className="flex-row items-center space-x-2 pl-1">
                    <MaterialCommunityIcons
                      name="information"
                      size={16}
                      color="#4F46E5"
                    />
                    <Text className="text-sm font-medium italic text-indigo-600">
                      Supervisor: {formData.supervisor.name}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Drop Point */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-gray-900">
              Drop Point
            </Text>
            <View className="space-y-4">
              <TouchableOpacity
                onPress={() => setDropPointVisible(true)}
                className="flex-row items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <Text
                  className={
                    formData.dropPoint
                      ? "text-base font-medium text-gray-900"
                      : "text-base text-gray-400"
                  }
                >
                  {formData.dropPoint || "Select drop point location"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={22}
                  color="#64748B"
                />
              </TouchableOpacity>

              {/* Quick Drop Point Selection */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row py-2">
                  {quickDropPoints.map((point) => (
                    <TouchableOpacity
                      key={point}
                      onPress={() => updateFormData({ dropPoint: point })}
                      className={`mr-3 rounded-full border px-5 py-2 shadow-sm ${
                        formData.dropPoint === point
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          formData.dropPoint === point
                            ? "text-indigo-700"
                            : "text-slate-600"
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
