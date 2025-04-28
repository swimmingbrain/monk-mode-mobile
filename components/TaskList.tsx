import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Plus, CheckCircle, Circle } from "lucide-react-native";
import { useRouter } from "expo-router";
import { getAllTasks, deleteTask, updateTask } from "@/services/TaskService";
import { Task } from "@/types/types";

const TaskList = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggle = async (task: Task) => {
    try {
      await updateTask(task.id, { isCompleted: !task.isCompleted });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t));
    } catch (error) {
      Alert.alert("Error", "Unable to change status.");
    }
  };

  const handleDelete = async (taskId: number) => {
    Alert.alert("Confirm deletion", "Do you really want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTask(taskId);
          setTasks(prev => prev.filter(t => t.id !== taskId));
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#fff" />;
  }

  return (
    <View className="flex gap-4">
      <View className="flex flex-row items-center justify-between">
        <Text className="text-xl text-secondary">Tasks</Text>
        <TouchableOpacity onPress={() => router.push("/tasks/create")}>\n          <Plus color="#c1c1c1" size={24} />
        </TouchableOpacity>
      </View>

      {tasks.length === 0 ? (
        <Text className="text-secondary">No tasks yet...</Text>
      ) : (
        tasks.map(task => (
          <View
            key={task.id}
            className="flex flex-row items-center justify-between bg-primary rounded-lg py-4 px-5"
          >
            <TouchableOpacity onPress={() => handleToggle(task)} className="mr-4">
              {task.isCompleted ? (
                <CheckCircle size={24} color="#4caf50" />
              ) : (
                <Circle size={24} color="#c1c1c1" />
              )}
            </TouchableOpacity>
            <View className="flex-1">
              <Text className={`text-secondary ${task.isCompleted ? "line-through" : ""}`}>
                {task.title}
              </Text>
              {task.dueDate && (
                <Text className="text-sm text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</Text>
              )}
            </View>
            <TouchableOpacity onPress={() => handleDelete(task.id)}>
              <Text className="text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </View>
  );
};

export default TaskList;