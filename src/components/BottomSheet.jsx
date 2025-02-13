import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
import { View, BackHandler, Keyboard } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import { ScrollView } from "react-native-gesture-handler";
import { Portal } from "@gorhom/portal";

const BottomSheet = React.forwardRef(
  (
    {
      children,
      visible,
      onClose,
      snapPoints: customSnapPoints,
      enablePanDownToClose = true,
      index = 0,
      footerComponent,
    },
    ref
  ) => {
    const bottomSheetRef = useRef(null);

    // Smooth close handling
    const smoothClose = useCallback(
      (withKeyboard = false) => {
        const doClose = () => {
          bottomSheetRef.current?.dismiss();
          // Give time for dismiss animation before calling onClose
          setTimeout(() => {
            onClose?.();
          }, 200);
        };

        if (withKeyboard) {
          Keyboard.dismiss();
          // Wait for keyboard animation to start
          setTimeout(doClose, 100);
        } else {
          doClose();
        }
      },
      [onClose]
    );

    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      forceClose: () => {
        smoothClose(Keyboard.isVisible());
      },
    }));

    // Track keyboard visibility for dynamic snap points
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => setIsKeyboardVisible(true)
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => setIsKeyboardVisible(false)
      );

      return () => {
        keyboardDidShowListener.remove();
        keyboardDidHideListener.remove();
      };
    }, []);

    // Handle dynamic snap points based on keyboard visibility
    const snapPoints = useMemo(() => {
      if (Array.isArray(customSnapPoints)) {
        // If array provided, use first point for normal and second point (if exists) for keyboard
        return [
          customSnapPoints[0],
          isKeyboardVisible && customSnapPoints[1]
            ? customSnapPoints[1]
            : customSnapPoints[0],
        ];
      }
      // Default snap points if none provided
      return [isKeyboardVisible ? "85%" : "50%"];
    }, [customSnapPoints, isKeyboardVisible]);

    // Animation configs for smooth transitions
    const animationConfigs = useMemo(
      () => ({
        damping: 30,
        mass: 0.8,
        stiffness: 400,
        overshootClamping: true,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
      }),
      []
    );

    // Handle sheet close
    const handleClose = useCallback(() => {
      smoothClose(Keyboard.isVisible());
    }, [smoothClose]);

    // Callbacks
    const handleSheetChanges = useCallback(
      (index) => {
        if (index === -1) {
          // Sheet is fully closed, wait for animation to complete
          setTimeout(() => {
            onClose?.();
          }, 200);
        }
      },
      [onClose]
    );

    // Handle hardware back button
    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          if (visible) {
            handleClose();
            return true;
          }
          return false;
        }
      );

      return () => backHandler.remove();
    }, [visible, handleClose]);

    // Handle visibility changes
    useEffect(() => {
      if (visible) {
        bottomSheetRef.current?.present();
      } else {
        handleClose();
      }
    }, [visible, handleClose]);

    // Memoized styles
    const backgroundStyle = useMemo(
      () => ({
        backgroundColor: "white",
        borderRadius: 24,
      }),
      []
    );

    const handleIndicatorStyle = useMemo(
      () => ({
        backgroundColor: "#CBD5E1",
        width: 40,
      }),
      []
    );

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
          animationConfigs={animationConfigs}
          backgroundStyle={backgroundStyle}
          handleIndicatorStyle={handleIndicatorStyle}
          backdropComponent={useCallback(
            (props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
                onPress={() => handleClose()}
              />
            ),
            [handleClose]
          )}
          footerComponent={footerComponent}
        >
          <View className="flex-1 bg-white">{children}</View>
        </BottomSheetModal>
      </Portal>
    );
  }
);

export default React.memo(BottomSheet);
