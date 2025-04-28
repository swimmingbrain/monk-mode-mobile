import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react-native";
import { getTimeBlocks } from "@/services/TimeblockService";
import { TimeBlock } from "@/types/types";
import TimeblockDialog from "./TimeblockDialogue";

const TimeblockList = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  useEffect(() => {
    fetchTimeBlocks();
  }, []);

  const fetchTimeBlocks = async () => {
    try {
      const token = "tbd";
      if (!token) throw new Error("No authentication token found.");

      /*const data = await getTimeBlocks(token);

      const sortedData = data.sort(
        (a: TimeBlock, b: TimeBlock) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setTimeBlocks(sortedData);*/
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch time blocks."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTimeblock = (timeblock: { title: string; date: string; startTime: string; endTime: string }) => {
    console.log("Saving timeblock:", timeblock);
    // Here you would typically call an API to save the timeblock
    // For now, we'll just close the dialog
    setDialogVisible(false);
  };

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
      <TouchableOpacity 
        className="flex flex-row items-center justify-end gap-2"
        onPress={() => setDialogVisible(true)}
      >
        <Plus color="#c1c1c1" size={20} />
        <Text className="text-secondary">Aktivität hinzufügen</Text>
      </TouchableOpacity>

      <TimeblockDialog 
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        onSave={handleSaveTimeblock}
      />
    </View>
  );
};

export default TimeblockList;
