import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { View, BackHandler } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { Portal } from "@gorhom/portal";

const BottomSheet = ({
  children,
  visible,
  onClose,
  snapPoints: customSnapPoints,
  enablePanDownToClose = true,
  index = 0,
  footerComponent,
}) => {
  const bottomSheetRef = useRef(null);

  // Default snap points if none provided (50% of screen height)
  const snapPoints = useMemo(
    () => customSnapPoints || ["50%"],
    [customSnapPoints]
  );

  // Callbacks
  const handleSheetChanges = useCallback(
    (index) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  // Handle hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (visible) {
          handleClosePress();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [visible, handleClosePress]);

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <Portal>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={index}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={enablePanDownToClose}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
        backgroundStyle={{
          backgroundColor: "white",
          borderRadius: 24,
        }}
        handleIndicatorStyle={{
          backgroundColor: "#CBD5E1",
          width: 40,
        }}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
        footerComponent={footerComponent}
      >
        <View style={{ flex: 1 }} className="bg-white">
          {children}
        </View>
      </BottomSheetModal>
    </Portal>
  );
};

export default BottomSheet;
