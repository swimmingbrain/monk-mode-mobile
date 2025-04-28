import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
import { X, Calendar, Clock } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface TimeblockDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (timeblock: { title: string; date: string; startTime: string; endTime: string }) => void;
}

const TimeblockDialog: React.FC<TimeblockDialogProps> = ({ visible, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Time picker states
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());

  const handleSave = () => {
    onSave({ title, date, startTime, endTime });
    // Reset form
    setTitle('');
    setDate('');
    setStartTime('');
    setEndTime('');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      // Format date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(formattedDate);
    }
  };

  const onStartTimeChange = (event: any, selectedTime?: Date) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setSelectedStartTime(selectedTime);
      // Format time as HH:MM
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setStartTime(`${hours}:${minutes}`);
    }
  };

  const onEndTimeChange = (event: any, selectedTime?: Date) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setSelectedEndTime(selectedTime);
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setEndTime(`${hours}:${minutes}`);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-lg p-5 w-[90%] max-w-[400px]">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-xl font-bold text-primary">Neue Aktivität</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#c1c1c1" size={24} />
            </TouchableOpacity>
          </View>
          
          <View className="mb-4">
            <Text className="mb-1 text-primary">Titel</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3 text-primary"
              value={title}
              onChangeText={setTitle}
              placeholder="Task"
              placeholderTextColor="#c1c1c1"
            />
          </View>
          
          <View className="mb-4">
            <Text className="mb-1 text-primary">Datum</Text>
            <TouchableOpacity 
              className="flex-row items-center border border-gray-300 rounded-md p-3"
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar color="#c1c1c1" size={20} className="mr-2" />
              <Text className="text-secondary flex-1">
                {date || "Datum auswählen"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
              />
            )}
          </View>
          
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="mb-1 text-primary">Startzeit</Text>
              <TouchableOpacity 
                className="flex-row items-center border border-gray-300 rounded-md p-3"
                onPress={() => setShowStartTimePicker(true)}
              >
                <Clock color="#c1c1c1" size={20} className="mr-2" />
                <Text className="text-secondary flex-1">
                  {startTime || "Zeit auswählen"}
                </Text>
              </TouchableOpacity>
              {showStartTimePicker && (
                <DateTimePicker
                  value={selectedStartTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onStartTimeChange}
                />
              )}
            </View>
            
            <View className="flex-1 ml-2">
              <Text className="mb-1 text-primary">Endzeit</Text>
              <TouchableOpacity 
                className="flex-row items-center border border-gray-300 rounded-md p-3"
                onPress={() => setShowEndTimePicker(true)}
              >
                <Clock color="#c1c1c1" size={20} className="mr-2" />
                <Text className="text-secondary flex-1">
                  {endTime || "Zeit auswählen"}
                </Text>
              </TouchableOpacity>
              {showEndTimePicker && (
                <DateTimePicker
                  value={selectedEndTime}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onEndTimeChange}
                />
              )}
            </View>
          </View>
          
          <TouchableOpacity 
            className="bg-primary rounded-md p-4 items-center mt-4"
            onPress={handleSave}
          >
            <Text className="text-white font-bold">Speichern</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TimeblockDialog; 