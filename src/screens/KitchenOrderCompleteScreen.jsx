import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";

const ConfirmationDialog = ({ visible, onClose, onConfirm }) => (
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
            >
              <Text className="text-center font-medium text-gray-700">
                Batal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 rounded-xl bg-green-600 py-3"
              onPress={onConfirm}
            >
              <Text className="text-center font-medium text-white">
                Ya, Selesai
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  </Modal>
);

const KitchenOrderCompleteScreen = ({ route, navigation }) => {
  const { order } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const [note, setNote] = useState("");
  const [showCamera, setShowCamera] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cameraType, setCameraType] = useState("back");
  const cameraRef = useRef(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleComplete = () => {
    if (photo && note) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmComplete = () => {
    setShowConfirmation(false);
    // Add a delay to let the modal close animation finish
    setTimeout(() => {
      navigation.replace("KitchenOrderSuccess", {
        order,
        photo,
        note,
      });
    }, 300);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.5,
          skipProcessing: true,
        };
        const result = await cameraRef.current.takePictureAsync(options);
        setPhoto(result);
        setShowCamera(false);
      } catch (error) {
        console.error("Error taking picture:", error);
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
          Kami membutuhkan izin kamera untuk mengambil foto pesanan.
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
          <TouchableOpacity onPress={handleBack} className="mr-4">
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#1F2937"
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
            onMountError={(error) => console.error("Camera error:", error)}
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
                className="h-16 w-16 items-center justify-center rounded-full bg-white"
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={32}
                  color="#1F2937"
                />
              </TouchableOpacity>
            </View>
          </CameraView>
        ) : photo ? (
          <View className="flex-1">
            <Image
              source={{ uri: photo.uri }}
              className="flex-1"
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => setShowCamera(true)}
              className="absolute bottom-4 right-4 rounded-full bg-blue-600 p-3"
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
            placeholder="Tambahkan catatan..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            className={`flex-row items-center justify-center rounded-xl py-4 ${
              photo && note ? "bg-green-600" : "bg-gray-300"
            }`}
            onPress={handleComplete}
            disabled={!photo || !note}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={24}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="font-semibold text-white">Pesanan Selesai</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        visible={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmComplete}
      />
    </SafeAreaView>
  );
};

export default KitchenOrderCompleteScreen;
