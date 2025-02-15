import React, { useState, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function JobTitleSelection({ jobTitle, onPress }) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`mb-4 rounded-xl border shadow-xl ${
          isPressed ? "border-gray-300 bg-gray-100" : "border-gray-200 bg-white"
        }`}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between">
            {jobTitle ? (
              <View className="mx-2 mr-3 rounded-xl bg-green-50 p-2">
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="#4CAF50"
                />
              </View>
            ) : (
              ""
            )}
            <View className="flex-1">
              <Text
                className={`  ${jobTitle ? "text-sm" : "text-lg"} ${
                  isPressed ? "text-gray-500" : "text-gray-500"
                }`}
              >
                Judul Pekerjaan
              </Text>
              {jobTitle ? (
                <Text
                  className={`mt-1 text-lg  ${
                    isPressed ? "text-gray-600" : "text-gray-800"
                  }`}
                >
                  {jobTitle}
                </Text>
              ) : (
                <Text
                  className={`mt-1 text-base ${
                    isPressed ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  Tambah judul pekerjaan
                </Text>
              )}
            </View>
            <View
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                jobTitle ? "bg-gray-50" : "bg-gray-50"
              }`}
            >
              <MaterialCommunityIcons
                name={jobTitle ? "pencil" : "plus"}
                size={20}
                color={jobTitle ? "#3B82F6" : "#9CA3AF"}
              />
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
