import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import ViewShot from "react-native-view-shot";
import { useKitchenStore } from "../store/kitchenStore";
import { useAuthStore } from "../store/authStore";

const ConfirmationDialog = ({ visible, onClose, onConfirm, isLoading }) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      className="flex-1 items-center justify-center bg-black/50 px-4"
      activeOpacity={1}
      onPress={onClose}
      disabled={isLoading}
    >
      <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
        <View className="w-full max-w-sm rounded-2xl bg-white p-6">
          <Text className="mb-2 text-xl font-semibold text-gray-900">
            Konfirmasi Selesai
          </Text>
          <Text className="mb-6 text-base text-gray-600">
            Apakah Anda yakin ingin menyelesaikan pesanan ini?
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              className="flex-1 rounded-xl border border-gray-300 bg-white py-3"
              onPress={onClose}
              disabled={isLoading}
            >
              <Text className="text-center font-medium text-gray-700">
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-xl bg-green-600 py-3"
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center font-medium text-white">
                  Ya, Selesai
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const WatermarkedImage = React.forwardRef(
  ({ imageUri, timestamp, order, userName }, ref) => (
    <ViewShot ref={ref} options={{ quality: 1, format: "jpg" }}>
      <View className="relative">
        <View style={{ aspectRatio: 3 / 4, width: "100%" }}>
          <Image
            source={{ uri: imageUri }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>
        <View className="absolute bottom-0 left-0 w-full bg-black/50 py-2">
          <View className="px-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-white">{userName}</Text>
              <Text className="text-sm font-bold text-white">Meal Order</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="mt-1 text-sm text-white">{timestamp}</Text>
              <Text className="text-lg font-bold text-white">#{order.id}</Text>
            </View>
          </View>
        </View>
      </View>
    </ViewShot>
  )
);

const KitchenOrderCompleteScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState("");
  const [showCamera, setShowCamera] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cameraType, setCameraType] = useState("back");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const cameraRef = useRef(null);
  const viewShotRef = useRef(null);

  const { completeOrder, isLoading, error, clearError } = useKitchenStore();
  const { user } = useAuthStore();

  // Handle errors with toast
  React.useEffect(() => {
    if (error) {
      ToastAndroid.show(error, ToastAndroid.SHORT);
      clearError();
    }
  }, [error]);

  const formatTimestamp = () => {
    const now = new Date();
    return (
      `${now.getDate().toString().padStart(2, "0")}/` +
      `${(now.getMonth() + 1).toString().padStart(2, "0")}/` +
      `${now.getFullYear()} ` +
      `${now.getHours().toString().padStart(2, "0")}:` +
      `${now.getMinutes().toString().padStart(2, "0")}:` +
      `${now.getSeconds().toString().padStart(2, "0")}`
    );
  };

  const processImage = async (uri) => {
    try {
      setIsProcessing(true);

      // Get screen dimensions
      const { width } = Dimensions.get("window");
      const targetWidth = width * 2; // 2x screen width for quality

      // Resize and compress image
      const resizeResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: targetWidth } }],
        { compress: 0.45, format: ImageManipulator.SaveFormat.JPEG }
      );

      return resizeResult;
    } catch (error) {
      console.error("Error processing image:", error);
      ToastAndroid.show(
        "Gagal memproses foto. Silakan coba lagi.",
        ToastAndroid.SHORT
      );
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (isLoading || isProcessing) return;
    navigation.goBack();
  };

  const handleComplete = () => {
    if (photo && !isLoading && !isProcessing) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmComplete = async () => {
    if (!photo?.uri || !viewShotRef.current) {
      ToastAndroid.show("Harap ambil foto bukti pesanan", ToastAndroid.SHORT);
      return;
    }

    try {
      setIsProcessing(true);
      // Capture the watermarked image
      const watermarkedUri = await viewShotRef.current.capture();

      const result = await completeOrder(order.id, watermarkedUri, note);
      if (result.success) {
        setShowConfirmation(false);
        // Navigate to success screen with watermarked photo
        navigation.replace("KitchenOrderSuccess", {
          order,
          photo: { uri: watermarkedUri },
          note,
        });
      }
    } catch (error) {
      ToastAndroid.show(
        error.message || "Gagal menyelesaikan pesanan",
        ToastAndroid.SHORT
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync({
          quality: 1,
          skipProcessing: true,
        });

        // Set timestamp when photo is taken
        setTimestamp(formatTimestamp());

        // Process image (optimize size)
        const processedImage = await processImage(result.uri);
        setPhoto(processedImage);
        setShowCamera(false);
      } catch (error) {
        console.error("Error taking picture:", error);
        ToastAndroid.show(
          "Gagal mengambil foto. Silakan coba lagi.",
          ToastAndroid.SHORT
        );
      }
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
        <Text className="mt-4 text-gray-600">Meminta izin kamera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <MaterialCommunityIcons
          name="camera-off"
          size={48}
          color="#EF4444"
          style={{ marginBottom: 16 }}
        />
        <Text className="mb-4 text-center text-base text-gray-900">
          Kami membutuhkan izin kamera untuk mengambil foto pesanan
        </Text>
        <TouchableOpacity
          className="rounded-lg bg-blue-600 px-6 py-3"
          onPress={requestPermission}
        >
          <Text className="font-medium text-white">Berikan Izin Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-6 py-4 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={handleBack}
            className="mr-4"
            disabled={isLoading || isProcessing}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={isLoading || isProcessing ? "#9CA3AF" : "#1F2937"}
            />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Selesaikan Pesanan
            </Text>
            <Text className="text-base text-gray-600">Order #{order.id}</Text>
          </View>
        </View>
      </View>

      {/* Camera or Photo Preview */}
      <View className="flex-1">
        {showCamera ? (
          <CameraView
            ref={cameraRef}
            className="flex-1"
            facing={cameraType}
            onMountError={(error) => {
              console.error("Camera error:", error);
              ToastAndroid.show(
                "Gagal memuat kamera. Silakan coba lagi.",
                ToastAndroid.SHORT
              );
            }}
          >
            <View className="flex-1 items-center justify-between pb-8">
              {/* Camera type toggle */}
              <TouchableOpacity
                onPress={() =>
                  setCameraType((current) =>
                    current === "back" ? "front" : "back"
                  )
                }
                className="m-4 rounded-full bg-white/20 p-2"
              >
                <MaterialCommunityIcons
                  name="camera-flip"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
              {/* Capture button */}
              <TouchableOpacity
                onPress={takePicture}
                disabled={isProcessing}
                className="h-16 w-16 items-center justify-center rounded-full bg-white"
              >
                {isProcessing ? (
                  <ActivityIndicator color="#1F2937" />
                ) : (
                  <MaterialCommunityIcons
                    name="camera"
                    size={32}
                    color="#1F2937"
                  />
                )}
              </TouchableOpacity>
            </View>
          </CameraView>
        ) : photo ? (
          <View className="flex-1">
            <WatermarkedImage
              ref={viewShotRef}
              imageUri={photo.uri}
              timestamp={timestamp}
              order={order}
              userName={user?.name || "Unknown"}
            />
            <TouchableOpacity
              onPress={() => setShowCamera(true)}
              className="absolute bottom-4 right-4 rounded-full bg-blue-600 p-3"
              disabled={isLoading || isProcessing}
            >
              <MaterialCommunityIcons
                name="camera-retake"
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      {/* Note Input and Complete Button */}
      {!showCamera && photo && (
        <View className="border-t border-gray-200 bg-white p-4">
          <TextInput
            className="mb-4 rounded-xl border border-gray-300 bg-white p-4 text-base"
            placeholder="Tambahkan catatan (opsional)..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            editable={!isLoading && !isProcessing}
          />
          <TouchableOpacity
            className={`flex-row items-center justify-center rounded-xl py-4 ${
              photo && !isProcessing ? "bg-green-600" : "bg-gray-300"
            }`}
            onPress={handleComplete}
            disabled={!photo || isLoading || isProcessing}
          >
            {isLoading || isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text className="font-semibold text-white">
                  Pesanan Selesai
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showConfirmation}
        onClose={() =>
          !isLoading && !isProcessing && setShowConfirmation(false)
        }
        onConfirm={handleConfirmComplete}
        isLoading={isLoading || isProcessing}
      />
    </SafeAreaView>
  );
};

export default KitchenOrderCompleteScreen;
