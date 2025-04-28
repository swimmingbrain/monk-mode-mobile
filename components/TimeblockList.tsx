import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react-native";
import { getTimeBlocks } from "@/services/TimeblockService";
import { TimeBlock } from "@/types/types";
import TimeblockDialog from "./TimeblockDialog";
// Einfache Funktion zur Generierung einer zufälligen ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const TimeblockList = () => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    // Create a new time block with a unique ID
    const newTimeBlock = {
      id: generateId(),
      ...timeblock,
      isFocus: false,
      tasks: []
    };
    
    // Add the new time block to the list
    setTimeBlocks(prevBlocks => [...prevBlocks, newTimeBlock]);
    
    // Close the dialog
    setDialogVisible(false);
  };

  const confirmDeleteTimeBlock = (id: string, title: string) => {
    Alert.alert(
      "Aktivität löschen",
      `Möchtest du "${title}" wirklich löschen?`,
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "Löschen",
          onPress: () => handleDeleteTimeBlock(id),
          style: "destructive"
        }
      ]
    );
  };

  const handleDeleteTimeBlock = (id: string) => {
    setTimeBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
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
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return selectedDate.toLocaleDateString('de-DE', options);
  };

  const getTimeBlocksForSelectedDate = () => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    return timeBlocks.filter(block => block.date === selectedDateString);
  };

  const timeBlocksForToday = getTimeBlocksForSelectedDate();

  return (
    <View className="flex gap-4">
      <View className="flex flex-row gap-2 items-center">
        <TouchableOpacity onPress={navigateToPreviousDay}>
          <ChevronLeft color="#c1c1c1" />
        </TouchableOpacity>
        <Text className="text-xl text-secondary flex-1 text-center">{formatSelectedDate()}</Text>
        <TouchableOpacity onPress={navigateToNextDay}>
          <ChevronRight color="#c1c1c1" />
        </TouchableOpacity>
      </View>
      
      {timeBlocksForToday.length === 0 ? (
        <TouchableOpacity className="flex flex-row gap-2 items-center bg-primary rounded-lg py-4 px-5">
          <Text className="text-secondary">noch nichts geplant ...</Text>
        </TouchableOpacity>
      ) : (
        <ScrollView className="max-h-[300px]">
          {timeBlocksForToday.map(timeBlock => (
            <View 
              key={timeBlock.id} 
              className="bg-primary rounded-lg py-4 px-5 mb-2 flex-row justify-between items-center"
            >
              <View className="flex-1">
                <Text className="text-secondary font-medium">{timeBlock.title}</Text>
                <Text className="text-secondary text-sm">
                  {timeBlock.startTime} - {timeBlock.endTime}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={() => timeBlock.id && confirmDeleteTimeBlock(timeBlock.id, timeBlock.title)}
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
