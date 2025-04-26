import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const FocusMode = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/");
  };

  return (
    <View className="bg-black flex items-center justify-center w-full h-full gap-10">
      <View className="flex items-center gap-6">
        <View className="bg-primary w-48 h-48 rounded-full flex items-center justify-center">
          <Text className="text-secondary text-4xl">01:23</Text>
        </View>
        <Text className="text-secondary">0 XP gesammelt</Text>
      </View>
      <TouchableOpacity
        onPress={handlePress}
        className="flex flex-row items-center bg-secondary rounded-lg py-4 px-20"
      >
        <Text className="text-primary text-lg">aufgeben</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FocusMode;
