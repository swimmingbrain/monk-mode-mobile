import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { createTask, CreateTaskDTO } from '@/services/TaskService';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateTasks = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }
    try {
      // Build DTO, omit dueDate if undefined
      const dto: CreateTaskDTO = {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? dueDate.toISOString() : undefined,
      };
      await createTask(dto);
      router.back();
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to create task');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-black p-4"
    >
      <Text className="text-xl text-secondary mb-4">Create Task</Text>

      <TextInput
        placeholder="Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        className="bg-primary text-secondary rounded-lg p-3 mb-4"
      />

      <TextInput
        placeholder="Description (optional)"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        multiline
        className="bg-primary text-secondary rounded-lg p-3 mb-4"
      />

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="bg-primary rounded-lg p-3 mb-4"
      >
        <Text className="text-secondary">
          {dueDate ? dueDate.toLocaleDateString() : 'Set Due Date (optional)'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dueDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setDueDate(date);
          }}
        />
      )}

      <TouchableOpacity
        onPress={onSave}
        className="bg-secondary rounded-lg py-4 items-center"
      >
        <Text className="text-primary text-lg">Save</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default CreateTasks;