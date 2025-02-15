import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import { BackHandler, Keyboard, Platform } from "react-native";
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

/**
 * A customized bottom sheet component that wraps @gorhom/bottom-sheet
 * Provides a modal bottom sheet with support for:
 * - Custom snap points
 * - Hardware back button handling
 * - Keyboard interaction
 * - Gesture handling
 * - Customizable animation
 */
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
    // Reference to the bottom sheet modal instance
    const bottomSheetModalRef = useRef(null);
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    /**
     * Handles keyboard show/hide events
     * Updates snap points dynamically based on keyboard state
     */
    useEffect(() => {
      const keyboardDidShow = () => setKeyboardVisible(true);
      const keyboardDidHide = () => setKeyboardVisible(false);

      const showSubscription = Keyboard.addListener(
        "keyboardDidShow",
        keyboardDidShow
      );
      const hideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        keyboardDidHide
      );

      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []);

    /**
     * Handles the hardware back button press
     * Returns true if the back press was handled, false otherwise
     */
    const handleBackPress = useCallback(() => {
      if (visible) {
        bottomSheetModalRef.current?.dismiss();
        return true;
      }
      return false;
    }, [visible]);

    // Set up hardware back press handler
    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [handleBackPress]);

    /**
     * Handles sheet index changes
     * Calls onClose when sheet is fully closed (index === -1)
     */
    const handleSheetChanges = useCallback(
      (index) => {
        if (index === -1) {
          onClose?.();
        }
      },
      [onClose]
    );

    /**
     * Handles visibility changes
     * Uses requestAnimationFrame for smooth animations
     */
    useEffect(() => {
      if (visible) {
        requestAnimationFrame(() => {
          bottomSheetModalRef.current?.present();
        });
      } else {
        bottomSheetModalRef.current?.dismiss();
      }
    }, [visible]);

    /**
     * Exposes methods to manipulate the bottom sheet
     * - dismiss: closes the sheet
     * - forceClose: alias for dismiss (backward compatibility)
     * - present: opens the sheet
     */
    React.useImperativeHandle(ref, () => ({
      dismiss: () => bottomSheetModalRef.current?.dismiss(),
      forceClose: () => bottomSheetModalRef.current?.dismiss(),
      present: () => bottomSheetModalRef.current?.present(),
    }));

    /**
     * Calculates the snap points for the sheet
     * Adjusts based on keyboard visibility
     */
    const snapPoints = useMemo(() => {
      // On Android, let the windowSoftInputMode handle keyboard
      if (Platform.OS === "android") {
        return Array.isArray(customSnapPoints) ? customSnapPoints : ["50%"];
      }

      // On iOS, adjust snap points when keyboard is visible
      if (Array.isArray(customSnapPoints)) {
        if (keyboardVisible) {
          // Don't exceed 75% when keyboard is visible
          return customSnapPoints.map((point) =>
            typeof point === "string" && parseInt(point) > 75 ? "75%" : point
          );
        }
        return customSnapPoints;
      }

      return keyboardVisible ? ["75%"] : ["50%"];
    }, [customSnapPoints, keyboardVisible]);

    /**
     * Animation configuration for smooth transitions
     * Tuned for optimal performance
     */
    const animationConfigs = useMemo(
      () => ({
        damping: 20,
        mass: 0.5,
        stiffness: 300,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
        velocity: 2,
      }),
      []
    );

    /**
     * Styles for the sheet container
     * Includes proper shadows and border radius
     */
    const containerStyle = useMemo(
      () => ({
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }),
      []
    );

    /**
     * Styles for the handle indicator
     * Provides visual cue for dragging
     */
    const handleIndicatorStyle = useMemo(
      () => ({
        backgroundColor: "#CBD5E1",
        width: 40,
      }),
      []
    );

    /**
     * Renders the backdrop component
     * Handles tap-to-close behavior
     */
    const renderBackdrop = useCallback(
      (props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={index}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose={enablePanDownToClose}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={true}
        animationConfigs={animationConfigs}
        backgroundStyle={containerStyle}
        handleIndicatorStyle={handleIndicatorStyle}
        android_keyboardInputMode="adjustResize"
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1 }}>{children}</BottomSheetView>
      </BottomSheetModal>
    );
  }
);

export default React.memo(BottomSheet);
