import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react-native";
import { getTimeBlocks } from "@/services/TimeblockService";
import { TimeBlock } from "@/types/types";

const TimeblockList = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTimeBlocks();
  }, []);

  const fetchTimeBlocks = async () => {
    try {
      console.log("fetch timeblocks ...");
      const token = "tbd";
      if (!token) throw new Error("No authentication token found.");

      const data = await getTimeBlocks(token);

      const sortedData = data.sort(
        (a: TimeBlock, b: TimeBlock) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      setTimeBlocks(sortedData);
    } catch (err) {
      console.log(err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch time blocks."
      );
    } finally {
      setLoading(false);
    }
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
      <TouchableOpacity className="flex flex-row items-center justify-end gap-2">
        <Plus color="#c1c1c1" size={20} />
        <Text className="text-secondary">Aktivität hinzufügen</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TimeblockList;
