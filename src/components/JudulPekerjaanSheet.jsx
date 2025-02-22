import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useEffect,
} from "react";
import {
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";

const JudulPekerjaanSheet = forwardRef(
  ({ onSave, isVisible, onClose }, ref) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["50%"], []);
    const [judulPekerjaan, setJudulPekerjaan] = useState("");

    // Reset input and close when sheet is dismissed
    const handleDismiss = useCallback(() => {
      setJudulPekerjaan("");
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

    // Handle save
    const handleSave = useCallback(() => {
      if (judulPekerjaan.trim()) {
        Keyboard.dismiss();
        onSave(judulPekerjaan);
        handleDismiss();
      }
    }, [judulPekerjaan, onSave, handleDismiss]);

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

    return (
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        index={isVisible ? 0 : -1}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
      >
        <View className="flex-1 p-4">
          <Text className="text-xl font-semibold text-black">
            Judul Pekerjaan
          </Text>

          <View className="mt-4 rounded-lg border border-gray-200 bg-white px-3">
            <BottomSheetTextInput
              placeholder="Masukkan judul pekerjaan"
              className="py-2.5 text-base text-gray-900"
              onChangeText={setJudulPekerjaan}
              value={judulPekerjaan}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!judulPekerjaan.trim()}
            className={`mt-4 rounded-lg p-4 ${
              judulPekerjaan.trim() ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <Text className="text-center text-base font-medium text-white">
              Simpan
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }
);

export default JudulPekerjaanSheet;
