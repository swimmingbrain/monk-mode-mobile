import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2, Pencil } from "lucide-react-native";
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
  const [editingTimeBlock, setEditingTimeBlock] = useState<TimeBlock | null>(null);

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

  const handleSaveTimeblock = (timeblock: { title: string; date: string; startTime: string; endTime: string; isFocus: boolean }) => {
    if (editingTimeBlock) {
      // Update existing time block
      setTimeBlocks(prevBlocks => {
        const updatedBlocks = prevBlocks.map(block => 
          block.id === editingTimeBlock.id 
            ? { ...block, ...timeblock } 
            : block
          );
        
          // Sort the updated blocks by date and time
          return updatedBlocks.sort((a, b) => {
            // First sort by date
            const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            if (dateComparison !== 0) return dateComparison;
            
            // If dates are the same, sort by start time
            const [aStartHour, aStartMin] = a.startTime.split(':').map(Number);
            const [bStartHour, bStartMin] = b.startTime.split(':').map(Number);
            
            if (aStartHour !== bStartHour) return aStartHour - bStartHour;
            return aStartMin - bStartMin;
          });
        });
      setEditingTimeBlock(null);
    } else {
      // Create a new time block with a unique ID
      const newTimeBlock = {
        id: generateId(),
        ...timeblock,
        tasks: []
      };
      
      // Add the new time block to the list and sort
      setTimeBlocks(prevBlocks => {
        const updatedBlocks = [...prevBlocks, newTimeBlock];
        
        // Sort the updated blocks by date and time
        return updatedBlocks.sort((a, b) => {
          // First sort by date
          const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          if (dateComparison !== 0) return dateComparison;
          
          // If dates are the same, sort by start time
          const [aStartHour, aStartMin] = a.startTime.split(':').map(Number);
          const [bStartHour, bStartMin] = b.startTime.split(':').map(Number);
          
          if (aStartHour !== bStartHour) return aStartHour - bStartHour;
          return aStartMin - bStartMin;
        });
      });
    }
    
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

  const handleEditTimeBlock = (timeBlock: TimeBlock) => {
    setEditingTimeBlock(timeBlock);
    setDialogVisible(true);
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
    // Check if the selected date is today
    const today = new Date();
    const isToday = selectedDate.toDateString() === today.toDateString();
    
    if (isToday) {
      return "Heute";
    } else {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return selectedDate.toLocaleDateString('de-DE', options);
    }
  };

  const getTimeBlocksForSelectedDate = () => {
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const filteredBlocks = timeBlocks.filter(block => block.date === selectedDateString);
    
    // Sort the filtered blocks by start time
    return filteredBlocks.sort((a, b) => {
      const [aStartHour, aStartMin] = a.startTime.split(':').map(Number);
      const [bStartHour, bStartMin] = b.startTime.split(':').map(Number);
      
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
                <Text className="text-secondary text-xs mt-1">
                  {timeBlock.isFocus ? 'Fokuszeit' : 'Freizeit'}
                </Text>
              </View>
              <View className="flex-row">
                <TouchableOpacity 
                  onPress={() => handleEditTimeBlock(timeBlock)}
                  className="p-2"
                >
                  <Pencil color="#c1c1c1" size={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => timeBlock.id && confirmDeleteTimeBlock(timeBlock.id, timeBlock.title)}
                  className="p-2"
                >
                  <Trash2 color="#c1c1c1" size={20} />
                </TouchableOpacity>
              </View>
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
        <Text className="text-secondary">Aktivität hinzufügen</Text>
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
