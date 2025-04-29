import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Plus, CheckCircle, Circle } from "lucide-react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getAllTasks, deleteTask, updateTask } from "@/services/TaskService";
import { Task } from "@/types/types";

const TaskList = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'open' | 'completed'>('open');

  const fetchTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Error loading tasks.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTasks();
    }, [])
  );

  const openTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  const handleToggle = async (task: Task) => {
    try {
      await updateTask(task.id, { isCompleted: !task.isCompleted });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t));
    } catch {
      Alert.alert("Error", "Unable to change status.");
    }
  };

  const handleDelete = async (taskId: number) => {
    Alert.alert("Confirm deletion", "Do you really want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        await deleteTask(taskId);
        setTasks(prev => prev.filter(t => t.id !== taskId));
      } }
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View className="flex-1 bg-black p-4">
      <View className="flex flex-row mb-4">
        <TouchableOpacity onPress={() => setActiveTab('open')} className={`flex-1 py-2 items-center rounded-t-lg ${activeTab === 'open' ? 'bg-secondary' : 'bg-primary'}`}>
          <Text className={`${activeTab === 'open' ? 'text-primary' : 'text-secondary'} font-semibold`}>Open Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('completed')} className={`flex-1 py-2 items-center rounded-t-lg ${activeTab === 'completed' ? 'bg-secondary' : 'bg-primary'}`}>
          <Text className={`${activeTab === 'completed' ? 'text-primary' : 'text-secondary'} font-semibold`}>Completed Tasks</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/tasks/createTasks')} className="flex flex-row items-center justify-end mb-2">
        <Plus color="#c1c1c1" size={24} />
      </TouchableOpacity>

      {activeTab === 'open' ? (
        openTasks.length === 0 ? (
          <Text className="text-secondary text-center">No open tasks.</Text>
        ) : (
          openTasks.map(task => (
            <View key={task.id} className="flex flex-row items-center justify-between bg-primary rounded-lg py-4 px-5 mb-2">
              <TouchableOpacity onPress={() => handleToggle(task)} className="mr-4">
                <Circle size={24} color="#c1c1c1" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-secondary">{task.title}</Text>
                {task.dueDate && <Text className="text-sm text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</Text>}
              </View>
              <TouchableOpacity onPress={() => handleDelete(task.id)}>
                <Text className="text-red-500">Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )
      ) : (
        completedTasks.length === 0 ? (
          <Text className="text-secondary text-center">No completed tasks.</Text>
        ) : (
          completedTasks.map(task => (
            <View key={task.id} className="flex flex-row items-center justify-between bg-primary rounded-lg py-4 px-5 mb-2">
              <TouchableOpacity onPress={() => handleToggle(task)} className="mr-4">
                <CheckCircle size={24} color="#4caf50" />
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-secondary line-through">{task.title}</Text>
                {task.dueDate && <Text className="text-sm text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</Text>}
              </View>
              <View className="flex flex-row">
                <TouchableOpacity onPress={() => handleToggle(task)} className="mr-4">
                  <Text className="text-blue-400">Undo</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(task.id)}>
                  <Text className="text-red-500">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )
      )}
    </View>
  );
};

export default TaskList;
