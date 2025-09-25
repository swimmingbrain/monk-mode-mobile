import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";
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
      <Feather name="target" color="#212121" size={24} />
      <Text className="text-primary font-semibold">Start Focus Mode</Text>
    </TouchableOpacity>
  );
};

export default FocusModeButton;
