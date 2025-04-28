import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import { X } from 'lucide-react-native';

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

  const handleSave = () => {
    onSave({ title, date, startTime, endTime });
    // Reset form
    setTitle('');
    setDate('');
    setStartTime('');
    setEndTime('');
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
            <TextInput
              className="border border-gray-300 rounded-md p-3 text-primary"
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#c1c1c1"
            />
          </View>
          
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 mr-2">
              <Text className="mb-1 text-primary">Startzeit</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-primary"
                value={startTime}
                onChangeText={setStartTime}
                placeholder="HH:MM"
                placeholderTextColor="#c1c1c1"
              />
            </View>
            
            <View className="flex-1 ml-2">
              <Text className="mb-1 text-primary">Endzeit</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3 text-primary"
                value={endTime}
                onChangeText={setEndTime}
                placeholder="HH:MM"
                placeholderTextColor="#c1c1c1"
              />
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