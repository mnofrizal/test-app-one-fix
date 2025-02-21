import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  View,
  Text,
  Keyboard,
  Pressable,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const dropPoints = [
  "Kantor Pusat Lt. 1",
  "Kantor Pusat Lt. 2",
  "Kantor Pusat Lt. 3",
  "Gedung B Lt. 1",
  "Gedung B Lt. 2",
  "Gedung C Lt. 1",
  "Gedung C Lt. 2",
  "Ruang Meeting Utama",
  "Lobby Utama",
];

// Uncontrolled search input component to prevent re-renders
const SearchInput = forwardRef(({ onSearch }, ref) => {
  const inputRef = useRef(null);
  const [localValue, setLocalValue] = useState("");

  // Expose reset function to parent
  useImperativeHandle(ref, () => ({
    reset: () => setLocalValue(""),
  }));

  const handleChangeText = useCallback(
    (text) => {
      setLocalValue(text);
      onSearch(text);
    },
    [onSearch]
  );

  return (
    <View className="mt-3 rounded-lg border border-gray-200 bg-white px-3">
      <BottomSheetTextInput
        ref={inputRef}
        placeholder="Search drop point"
        className="py-2.5 text-base text-gray-900"
        onChangeText={handleChangeText}
        value={localValue}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />
    </View>
  );
});

// Main DropPointSelector component
const DropPointSelector = forwardRef(
  ({ onSelect, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);
    const searchInputRef = useRef(null);
    const snapPoints = useMemo(() => ["50%", "90%"], []);
    const [searchText, setSearchText] = useState("");

    // Filter points based on search
    const filteredPoints = useMemo(() => {
      if (!searchText) return dropPoints;
      const searchLower = searchText.toLowerCase();
      return dropPoints.filter((point) =>
        point.toLowerCase().includes(searchLower)
      );
    }, [searchText]);

    // Reset search and close when sheet is dismissed
    const handleDismiss = useCallback(() => {
      searchInputRef.current?.reset();
      setSearchText("");
      onClose();
      bottomSheetRef.current?.close();
    }, [onClose]);

    // Handle back press
    useEffect(() => {
      if (!isVisible) return;

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          onClose();
          handleDismiss();
          return true;
        }
      );

      return () => backHandler.remove();
    }, [isVisible, onClose, handleDismiss]);

    // Memoize sheet change handler
    const handleSheetChange = useCallback(
      (index) => {
        if (index === -1) {
          handleDismiss();
        }
      },
      [handleDismiss]
    );

    // Memoize backdrop component
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      ),
      []
    );

    // Render each drop point item
    const renderItem = useCallback(
      ({ item: point }) => (
        <TouchableOpacity
          onPress={() => {
            onSelect(point);
            handleDismiss();
          }}
          className="mx-3 my-1 flex-row items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
        >
          <Text className="text-base text-gray-800">{point}</Text>
        </TouchableOpacity>
      ),
      [onSelect, handleDismiss]
    );

    // Add new point option when no matches found
    const ListHeaderComponent = useCallback(() => {
      if (!searchText || filteredPoints.length > 0) return null;

      return (
        <TouchableOpacity
          onPress={() => {
            onSelect(searchText);
            handleDismiss();
          }}
          className="mx-3 my-1 flex-row items-center justify-between rounded-lg border border-blue-500 bg-blue-50 p-4"
        >
          <View>
            <Text className="text-base text-blue-600">
              Tambahkan "{searchText}"
            </Text>
            <Text className="text-sm text-gray-500">
              sebagai drop point baru
            </Text>
          </View>
          <MaterialCommunityIcons
            name="plus-circle"
            size={20}
            color="#2563EB"
          />
        </TouchableOpacity>
      );
    }, [searchText, filteredPoints.length, handleDismiss, onSelect]);

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={isVisible ? 1 : -1}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
      >
        <View className="flex-1">
          <View className="absolute left-0 right-0 top-0 z-10 bg-white shadow-sm">
            <View className="p-4">
              <Text className="text-xl font-semibold text-black">
                Select Drop Point
              </Text>
              <SearchInput ref={searchInputRef} onSearch={setSearchText} />
            </View>
          </View>
          <View className="flex-1" style={{ marginTop: 130 }}>
            <BottomSheetFlashList
              data={filteredPoints}
              renderItem={renderItem}
              keyExtractor={(point) => point}
              estimatedItemSize={77}
              ListHeaderComponent={ListHeaderComponent}
              contentContainerStyle={{ paddingVertical: 8 }}
            />
          </View>
        </View>
      </BottomSheet>
    );
  }
);

export default DropPointSelector;
