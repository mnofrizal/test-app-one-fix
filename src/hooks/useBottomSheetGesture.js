import { useMemo } from "react";
import { Platform } from "react-native";

export const useBottomSheetGesture = () => {
  return useMemo(
    () => ({
      // Animation configurations for smooth transitions
      animationConfigs: {
        velocity: 0.6,
        damping: 60,
        stiffness: 600,
        mass: 1,
        overshootClamping: false,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
      },

      // Gesture configurations
      gestureConfigs: {
        enableContentPanningGesture: true,
        enableHandlePanningGesture: true,
        overDragResistanceFactor: 0,
      },

      // Keyboard behavior based on platform
      keyboardConfigs: {
        keyboardBehavior: "interactive",
        keyboardBlurBehavior: "restore",
        android_keyboardInputMode: Platform.select({
          android: "adjustResize",
          default: undefined,
        }),
      },
    }),
    []
  );
};
