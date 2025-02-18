import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlashList,
} from "@gorhom/bottom-sheet";

const TestGorhomSheet = ({
  visible,
  onClose,
  onSelect,
  title = "Select Employee",
  data = [],
  searchQuery = "",
  onSearchChange,
  isLoading = false,
}) => {
  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ["75%"], []);

  // Callbacks
  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    onClose?.();
  }, [onClose]);

  const handleSelect = useCallback(
    (item) => {
      onSelect?.(item);
      bottomSheetRef.current?.dismiss();
    },
    [onSelect]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        style={styles.employeeItem}
      >
        <View>
          <Text style={styles.employeeName}>{item.name}</Text>
          <Text style={styles.employeeDepartment}>{item.department}</Text>
          {item.nomorHp && (
            <Text style={styles.employeePhone}>{item.nomorHp}</Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    [handleSelect]
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isLoading ? "Loading employees..." : "No users found"}
        </Text>
      </View>
    ),
    [isLoading]
  );

  const keyExtractor = useCallback((item) => item.id || item.name, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      snapPoints={snapPoints}
      enableDynamicSizing={true}
      enableOverDrag={true}
      enablePanDownToClose={true}
      animateOnMount={true}
      animationConfigs={{
        duration: 250,
      }}
      onChange={handleSheetChanges}
      style={styles.bottomSheet}
      handleIndicatorStyle={styles.indicator}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
    >
      <View style={styles.bottomSheetContent}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#111827"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
        </View>

        {/* Fixed Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={onSearchChange}
            />
          </View>
        </View>

        {/* Scrollable List */}
        <BottomSheetFlashList
          data={data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={88}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "white",
  },
  bottomSheetContent: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  indicator: {
    backgroundColor: "#E5E7EB",
    width: 32,
  },
  listContainer: {
    backgroundColor: "white",
    paddingTop: 120, // Height of header (52) + search container (68)
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "white",
    zIndex: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  searchContainer: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    padding: 16,
    height: 68,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "white",
    zIndex: 2,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#111827",
  },
  employeeItem: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  employeeDepartment: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  employeePhone: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});

export default TestGorhomSheet;
