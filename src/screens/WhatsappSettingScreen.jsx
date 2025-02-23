import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import WhatsappGroupSheet from "../components/WhatsappGroupSheet";
import SkeletonWhatsappSetting from "../components/SkeletonWhatsappSetting";

const WhatsappSettingScreen = () => {
  const [serverStatus, setServerStatus] = useState("Connected");
  const [currentSheet, setCurrentSheet] = useState(null);

  // States for selected groups
  const [selectedGroups, setSelectedGroups] = useState({
    admin: null,
    kitchen: null,
    notif: null,
  });

  const handleOpenSheet = (group) => {
    setCurrentSheet(group);
  };

  const handleCloseSheet = () => {
    setCurrentSheet(null);
  };

  const handleSelectGroup = (group, type) => {
    setSelectedGroups((prev) => ({
      ...prev,
      [type]: group,
    }));
  };

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRendered(true);
    }, 380);

    return () => clearTimeout(timer);
  }, []);

  if (!isRendered) {
    return <SkeletonWhatsappSetting />;
  }

  return (
    <View className="flex-1 bg-white p-4">
      {/* Server Status Section */}
      <View className="mb-6">
        <Text className="mb-4 text-lg font-bold text-gray-900">
          WhatsApp Server Status
        </Text>
        <View className="flex-row items-center rounded-lg bg-gray-100 p-4">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              serverStatus === "Connected" ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <Text className="text-base text-gray-800">{serverStatus}</Text>
        </View>
      </View>

      {/* Notification Settings Section */}
      <View className="flex-1">
        <Text className="mb-4 text-lg font-bold text-gray-900">
          Notification Settings
        </Text>

        <TouchableOpacity
          className="flex-row items-center justify-between border-b border-gray-200 py-4"
          onPress={() => handleOpenSheet("admin")}
        >
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">
              Admin Group
            </Text>
            <Text className="text-sm text-gray-500">
              {selectedGroups.admin?.name || "Select Group"}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between border-b border-gray-200 py-4"
          onPress={() => handleOpenSheet("kitchen")}
        >
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">
              Kitchen Group
            </Text>
            <Text className="text-sm text-gray-500">
              {selectedGroups.kitchen?.name || "Select Group"}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between border-b border-gray-200 py-4"
          onPress={() => handleOpenSheet("notif")}
        >
          <View className="flex-1">
            <Text className="text-base font-medium text-gray-900">
              Notif Group
            </Text>
            <Text className="text-sm text-gray-500">
              {selectedGroups.notif?.name || "Select Group"}
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Bottom Sheets */}
      <WhatsappGroupSheet
        isVisible={currentSheet === "admin"}
        onClose={handleCloseSheet}
        onSelect={(group) => handleSelectGroup(group, "admin")}
        selectedGroup={selectedGroups.admin}
      />
      <WhatsappGroupSheet
        isVisible={currentSheet === "kitchen"}
        onClose={handleCloseSheet}
        onSelect={(group) => handleSelectGroup(group, "kitchen")}
        selectedGroup={selectedGroups.kitchen}
      />
      <WhatsappGroupSheet
        isVisible={currentSheet === "notif"}
        onClose={handleCloseSheet}
        onSelect={(group) => handleSelectGroup(group, "notif")}
        selectedGroup={selectedGroups.notif}
      />
    </View>
  );
};

export default WhatsappSettingScreen;
