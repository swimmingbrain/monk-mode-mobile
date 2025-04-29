import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTaskById, updateTask } from '@/services/TaskService';
import { Task } from '@/types/types';

export default function EditTask() {
  const { tasksid } = useSearchParams<{ tasksid: string }>();
  const router = useRouter();
  const taskId = Number(tasksid);

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await getTaskById(taskId);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setDueDate(data.dueDate ? new Date(data.dueDate) : undefined);
      } catch (err) {
        Alert.alert('Error', err instanceof Error ? err.message : 'Failed to load task');
        router.back();
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [taskId]);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }
    try {
      const dto: Partial<Task> = { title: title.trim(), isCompleted: task?.isCompleted ?? false };
      if (description.trim()) dto.description = description.trim();
      if (dueDate) dto.dueDate = dueDate.toISOString();
      await updateTask(taskId, dto);
      router.back();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to update task');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-black p-4"
    >
      <Text className="text-xl text-secondary mb-4">Edit Task</Text>

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
          onChange={(_, d) => {
            setShowDatePicker(false);
            if (d) setDueDate(d);
          }}
        />
      )}

      <TouchableOpacity
        onPress={onSave}
        className="bg-secondary rounded-lg py-4 items-center"
      >
        <Text className="text-primary text-lg">Save Changes</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
