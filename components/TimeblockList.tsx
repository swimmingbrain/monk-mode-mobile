import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react-native";
import { createTimeBlock, getTimeBlocks } from "@/services/TimeblockService";
import { TimeBlock } from "@/types/types";
import TimeblockDialog from "./TimeblockDialog";

const TimeblockList = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTimeBlock, setEditingTimeBlock] = useState<TimeBlock | null>(
    null
  );

  useEffect(() => {
    fetchTimeBlocks();
  }, []);

  const fetchTimeBlocks = async () => {
    try {
      const data = await getTimeBlocks();
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

  const handleSaveTimeblock = async (timeblock: {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    isFocus: boolean;
  }) => {
    if (editingTimeBlock) {
      setTimeBlocks((prevBlocks) =>
        prevBlocks
          .map((block) =>
            block.id === editingTimeBlock.id
              ? { ...block, ...timeblock }
              : block
          )
          .sort((a, b) => sortByDateAndTime(a, b))
      );
      setEditingTimeBlock(null);
    } else {
      const newTimeBlock = { ...timeblock, tasks: [] };
      const dbTimeblock = await createTimeBlock(newTimeBlock);
      setTimeBlocks((prevBlocks) =>
        [...prevBlocks, dbTimeblock].sort((a, b) => sortByDateAndTime(a, b))
      );
    }
    setDialogVisible(false);
  };

  const sortByDateAndTime = (a: TimeBlock, b: TimeBlock) => {
    const dateComparison =
      new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    const [aStartHour, aStartMin] = a.startTime.split(":").map(Number);
    const [bStartHour, bStartMin] = b.startTime.split(":").map(Number);
    if (aStartHour !== bStartHour) return aStartHour - bStartHour;
    return aStartMin - bStartMin;
  };

  const confirmDeleteTimeBlock = (id: string, title: string) => {
    Alert.alert(
      "Delete Activity",
      `Delete "${title}" permanently?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => handleDeleteTimeBlock(id),
          style: "destructive",
        },
      ]
    );
  };

  const handleDeleteTimeBlock = (id: string) => {
    setTimeBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== id)
    );
  };

  const navigateToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const navigateToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const formatSelectedDate = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    } else {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return selectedDate.toLocaleDateString("en-US", options);
    }
  };

  const getTimeBlocksForSelectedDate = () => {
    const selectedDateString = selectedDate.toISOString().split("T")[0];
    const filteredBlocks = timeBlocks.filter(
      (block) => block.date.startsWith(selectedDateString)
    );
    return filteredBlocks.sort((a, b) => {
      const [aStartHour, aStartMin] = a.startTime.split(":").map(Number);
      const [bStartHour, bStartMin] = b.startTime.split(":").map(Number);
      if (aStartHour !== bStartHour) return aStartHour - bStartHour;
      return aStartMin - bStartMin;
    });
  };

  const timeBlocksForToday = getTimeBlocksForSelectedDate();

  return (
    <View className="flex gap-4">
      <View className="flex flex-row gap-2 items-center">
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <ChevronLeft color="#c1c1c1" />
        </TouchableOpacity>
        <Text className="text-xl text-secondary flex-1 text-center">
          {formatSelectedDate()}
        </Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <ChevronRight color="#c1c1c1" />
        </TouchableOpacity>
      </View>

      {timeBlocksForToday.length === 0 ? (
        <TouchableOpacity className="flex flex-row gap-2 items-center bg-primary rounded-lg py-4 px-5">
          <Text className="text-secondary">nothing planned yet ...</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView>
          {timeBlocksForToday.map((timeBlock) => (
            <View
              key={timeBlock.id}
              className="bg-primary rounded-lg py-4 px-5 mb-2 flex-row justify-between items-center"
            >
              <TouchableOpacity
                onPress={() => {
                  setEditingTimeBlock(timeBlock);
                  setDialogVisible(true);
                }}
                className="flex-1"
              >
                <View>
                  <Text className="text-secondary font-medium">
                    {timeBlock.title}
                  </Text>
                  <Text className="text-secondary text-sm">
                    {timeBlock.startTime} - {timeBlock.endTime}
                  </Text>
                  <Text className="text-secondary text-xs mt-1">
                    {timeBlock.isFocus ? "Focus" : "Leisure"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  timeBlock.id &&
                  confirmDeleteTimeBlock(timeBlock.id, timeBlock.title)
                }
                className="p-2"
              >
                <Trash2 color="#c1c1c1" size={20} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        className="flex flex-row items-center justify-end gap-2"
        onPress={() => {
          setEditingTimeBlock(null);
          setDialogVisible(true);
        }}
      >
        <Plus color="#c1c1c1" size={20} />
        <Text className="text-secondary">Add Activity</Text>
      </TouchableOpacity>

      <TimeblockDialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false);
          setEditingTimeBlock(null);
        }}
        onSave={handleSaveTimeblock}
        timeBlock={editingTimeBlock}
      />
    </View>
  );
};

export default TimeblockList;
