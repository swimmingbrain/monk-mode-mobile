import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Target } from "lucide-react-native";
import { useRouter } from "expo-router";

const FocusModeButton = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/focusmode/FocusMode");
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex flex-row gap-2 items-center bg-secondary rounded-lg py-4 px-5"
    >
      <Target color="#212121" size={24} />
      <Text className="text-primary font-semibold">Fokusmodus starten</Text>
    </TouchableOpacity>
  );
};

export default FocusModeButton;
