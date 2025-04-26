import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react-native";

const TimeblockList = () => {
  return (
    <View className="flex gap-4">
      <View className="flex flex-row gap-2 items-center">
        <ChevronLeft color="#c1c1c1" />
        <Text className="text-xl text-secondary">Heute</Text>
        <ChevronRight color="#c1c1c1" />
      </View>
      <TouchableOpacity className="flex flex-row gap-2 items-center bg-primary rounded-lg py-4 px-5">
        <Text className="text-secondary">noch nichts geplant ...</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-row items-center justify-end gap-2">
        <Plus color="#c1c1c1" size={20} />
        <Text className="text-secondary">Aktivität hinzufügen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimeblockList;
