import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MoveRight } from "lucide-react-native";

const CurrentFocusTime = () => {
  return (
    <View className="flex gap-4">
      <View className="flex flex-row gap-2 items-center justify-between">
        <Text className="text-xl text-secondary">Aktuelle Fokuszeiten</Text>
        <TouchableOpacity className="flex flex-row items-center justify-end gap-2">
          <Text className="text-secondary">alle Statistiken</Text>
          <MoveRight color="#c1c1c1" size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="flex flex-row gap-2 items-center justify-center bg-primary rounded-lg py-32 px-5">
        <Text className="text-secondary">not available yet ...</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CurrentFocusTime;
