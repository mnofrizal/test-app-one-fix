import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AddMenuSheet from "../components/menu/AddMenuSheet";
import { useMenuStore } from "../store/menuStore";

const CATEGORY_COLORS = {
  HEAVY_MEAL: "bg-blue-100 text-blue-800",
  SNACK: "bg-green-100 text-green-800",
};

const ListMenuScreen = ({ navigation }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { menus, isLoading, error, fetchMenus, toggleAvailability } =
    useMenuStore();

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleToggleAvailability = async (id, currentValue) => {
    const result = await toggleAvailability(id, !currentValue);
    if (!result.success) {
      // Could show error toast here
      console.log("Failed to toggle availability:", result.message);
    }
  };

  const renderItem = ({ item }) => (
    <View className="mb-4 rounded-lg bg-white p-4 shadow">
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900">{item.name}</Text>
        <View
          className={`rounded-full px-3 py-1 ${
            CATEGORY_COLORS[item.category]?.split(" ")[0] || "bg-gray-100"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              CATEGORY_COLORS[item.category]?.split(" ")[1] || "text-gray-800"
            }`}
          >
            {item.category.replace("_", " ")}
          </Text>
        </View>
      </View>
      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className={`mr-2 h-2 w-2 rounded-full ${
              item.isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <Text className="text-sm text-gray-600">
            {item.isAvailable ? "Available" : "Not Available"}
          </Text>
        </View>
        <Switch
          value={item.isAvailable}
          onValueChange={() =>
            handleToggleAvailability(item.id, item.isAvailable)
          }
          trackColor={{ false: "#cbd5e1", true: "#93c5fd" }}
          thumbColor={item.isAvailable ? "#2563eb" : "#f4f4f5"}
        />
      </View>
    </View>
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddMenuClose = () => {
    setShowAddMenu(false);
    // Refresh the menu list after adding
    fetchMenus();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-4">
        <TouchableOpacity
          onPress={handleBackPress}
          className="rounded-full p-2"
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Menu List</Text>
        <TouchableOpacity
          onPress={() => setShowAddMenu(true)}
          className="rounded-full bg-blue-600 p-2"
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Error State */}
      {error && (
        <View className="m-4 rounded-lg bg-red-50 p-4">
          <Text className="text-sm text-red-800">{error}</Text>
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : (
        <FlatList
          data={menus}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          ListEmptyComponent={
            <View className="mt-4 items-center">
              <Text className="text-gray-500">No menus available</Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={fetchMenus}
        />
      )}

      {/* Add Menu Sheet */}
      <AddMenuSheet visible={showAddMenu} onClose={handleAddMenuClose} />
    </SafeAreaView>
  );
};

export default ListMenuScreen;
