import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getTaskById, updateTask } from '@/services/TaskService';
import { Task } from '@/types/types';

export default function EditTask() {
  const { taskid } = useLocalSearchParams<{ taskid: string }>();
  const router = useRouter();
  const id = Number(taskid);

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Auto-default dueDate to today on first open of picker
  useEffect(() => {
    if (showDatePicker && dueDate === undefined) {
      setDueDate(new Date());
    }
  }, [showDatePicker]);

  // Load existing task
  useEffect(() => {
    async function load() {
      try {
        const data = await getTaskById(id);
        setTask(data);
        setTitle(data.title);
        setDescription(data.description ?? '');
        setDueDate(data.dueDate ? new Date(data.dueDate) : undefined);
      } catch (err) {
        Alert.alert(
          'Error',
          err instanceof Error ? err.message : 'Failed to load task'
        );
        router.back();
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }
    // Prevent past-dates
    if (dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const sel = new Date(dueDate);
      sel.setHours(0, 0, 0, 0);
      if (sel < today) {
        Alert.alert('Validation', 'Due date cannot be in the past');
        return;
      }
    }

    setSaving(true);
    try {
      const dto: Partial<Task> = {
        title: title.trim(),
        isCompleted: task?.isCompleted ?? false,
      };
      if (description.trim()) dto.description = description.trim();
      if (dueDate) dto.dueDate = dueDate.toISOString();
      await updateTask(id, dto);
      router.back();
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to update task'
      );
    } finally {
      setSaving(false);
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
          minimumDate={new Date()}
          onChange={(_, date) => {
            setShowDatePicker(false);
            if (date) setDueDate(date);
          }}
        />
      )}

      <TouchableOpacity
        onPress={onSave}
        disabled={saving}
        className="bg-secondary rounded-lg py-4 items-center"
      >
        {saving ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text className="text-primary text-lg">Save Changes</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}