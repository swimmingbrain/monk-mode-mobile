import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Plus } from "lucide-react-native";

const TaskList = () => {
  return (
    <View className="flex gap-4">
      <View className="flex flex-row gap-2 items-center">
        <Text className="text-xl text-secondary">Aufgaben</Text>
      </View>
      <TouchableOpacity className="flex flex-row gap-2 items-center bg-primary rounded-lg py-4 px-5">
        <Text className="text-secondary">Aufgabe 1</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex flex-row items-center justify-end gap-2">
        <Plus color="#c1c1c1" size={20} />
        <Text className="text-secondary">Aufgabe hinzufügen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskList;
